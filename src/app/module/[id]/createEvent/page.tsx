'use client'
import { useRouter } from "next/navigation";
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios, { AxiosError } from "axios"

import { Button } from "~/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { toast } from "sonner";
import { Label } from "~/components/ui/label";
import { env } from "~/env"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "~/app/utils/firebase";
import { Spinner } from "~/components/ui/spinner";
export const runtime = "edge";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Event name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    registrationStartTime: z.string().nonempty("Registration start time is required."),
    registrationEndTime: z.string().nonempty("Registration end time is required."),
    minTeamSize: z.number().min(1).optional(),
    maxTeamSize: z.number().min(1).optional(),
    posterImage: z.string().url().optional(),
    attendanceIncentive: z.number().min(0).optional(),
    registrationIncentive: z.number().min(0).optional(),
    prizeDescription: z.string().optional(),
    stagesDescription: z.string().optional(),
    venue: z.string().optional(),
    lat: z.string().optional(),
    lng: z.string().optional(),
    extraQuestions: z.array(z.object({}).strict()).optional(),
})

interface moduleParams {
    id: string;
}

async function postData(data: z.infer<typeof formSchema>, token: string | undefined, moduleId: string) {
    const response = await axios.post(`${env.NEXT_PUBLIC_API_URL}/api/event/create`, {
        moduleId,
        ...data,
    }, { headers: { Authorization: `Bearer ${token}` } })
    return response
}

export default function CreateEventForm({ params }: { params: moduleParams }) {
    const [eventType, setEventType] = useState("solo")
    const [user, loading] = useAuthState(auth)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            registrationStartTime: "",
            registrationEndTime: "",
            minTeamSize: 1,
            maxTeamSize: 1,
            posterImage: "",
            attendanceIncentive: 1,
            registrationIncentive: 1,
            prizeDescription: "",
            stagesDescription: "",
            venue: "",
            lat: "",
            lng: "",
            extraQuestions: [{}],
        },
    })
    const router = useRouter();
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const token = await user?.getIdToken()
        toast.promise(postData(data, token, params.id), {
            success: () => {
                setTimeout(() => {
                    router.push(`/module/${params.id}`)
                }, 200)
                return "Event created successfully"
            },
            loading: "Creating Event...",
            error: (e: AxiosError<{msg: string}>) => {
                return e.response?.data.msg
            }
        })
    }
    if (loading) {
        return (
          <div className="flex w-screen h-screen justify-center items-center gap-3">
            <Spinner size="large" />
          </div>
        )
    }
    return (
        <div className="py-2 flex flex-col gap-10 min-h-screen items-center justify-center bg-gray-900">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter event name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the event" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="registrationStartTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Registration Start Time</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="registrationEndTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Registration End Time</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Type of Event</FormLabel>
                        <FormControl>
                            <RadioGroup
                                value={eventType}
                                onValueChange={setEventType}
                            >
                                <div className="flex flex-row gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="solo" id="solo" />
                                        <Label htmlFor="solo">Solo</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="group" id="group" />
                                        <Label htmlFor="group">Group</Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </FormControl>
                    </FormItem>

                    {eventType === "group" && (
                        <>
                            <FormField
                                control={form.control}
                                name="minTeamSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minimum Team Size</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Minimum team size"
                                                value={field.value}
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxTeamSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum Team Size</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Maximum team size"
                                                value={field.value}
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    <Button type="submit">Create Event</Button>
                </form>
            </Form>
        </div>
    )
}
