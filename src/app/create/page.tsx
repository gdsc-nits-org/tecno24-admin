'use client'
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { env } from "~/env"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { Spinner } from "~/components/ui/spinner";
export const runtime = "edge";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Module name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    iconImage: z.string().url({message: "Must be valid URL"}),
    coverImage: z.string().url({message: "Must be valid URL"}),
    thirdPartyURL: z.string().url({message: "Must be valid URL"})
})


interface moduleParams {
    id: string;
}

async function postData(data: z.infer<typeof formSchema>, token: string | undefined) {
    const response = await axios.post(`${env.NEXT_PUBLIC_API_URL}/api/module/create`, data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return response
}

export default function CreateModuleForm({ params }: { params: moduleParams }) {
    const [user, loading] = useAuthState(auth);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            iconImage: "",
            coverImage: "",
            thirdPartyURL: ""
        },
    })
    const router = useRouter();
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const token = await user?.getIdToken();
        toast.promise(postData(data, token), {
            loading: "Creating Module>...",
            success: () => {
                setTimeout(() => {
                    router.push(`/dashboard`)
                }, 200)
                return `Module ${data.name} has been created`
            },
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
                                <FormLabel>Module Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Module Name" {...field} />
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
                                <FormLabel>Module Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the Module" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="iconImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icon Image (URL)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://gravatar.com/image.png" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image (URL)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://gravatar.com/image.png" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="thirdPartyURL"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Third Party URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://devfolio.com/tecno/register" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create Module</Button>
                </form>
            </Form>
        </div>
    )
}
