'use client'
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
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
    // files will be validated client-side in onSubmit (FileList), keep loose typing here
    iconImage: z.any(),
    coverImage: z.any(),
    thirdPartyURL: z.string().optional()
})


interface moduleParams {
    id: string;
}

type FormValues = {
    name: string;
    description: string;
    iconImage?: FileList | null;
    coverImage?: FileList | null;
    thirdPartyURL?: string;
}

async function postData(data: FormData, token: string | undefined) {
    const response = await axios.post(`${env.NEXT_PUBLIC_API_URL}/api/module/create`, data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                // Let browser set multipart boundary; do not set Content-Type here
            }
        }
    )
    return response
}

export default function CreateModuleForm({ params: _params }: { params: moduleParams }) {
    const [user, loading] = useAuthState(auth);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            iconImage: undefined,
            coverImage: undefined,
            thirdPartyURL: ""
        },
    })
    const router = useRouter();
    const onSubmit = async (data: FormValues) => {
        // data.iconImage and data.coverImage are expected to be FileList objects
        const token = await user?.getIdToken();

        const iconFile = data.iconImage?.[0];
        const coverFile = data.coverImage?.[0];

        if (!iconFile || !coverFile) {
            toast.error("Please provide both an icon image and a cover image.");
            return;
        }

        const MAX_SIZE_MB = 2;
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

        if (iconFile.size > MAX_SIZE_BYTES) {
            toast.error(`Icon image must be less than ${MAX_SIZE_MB}MB`);
            return;
        }
        if (coverFile.size > MAX_SIZE_BYTES) {
            toast.error(`Cover image must be less than ${MAX_SIZE_MB}MB`);
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        if (data.thirdPartyURL) formData.append("thirdPartyURL", data.thirdPartyURL);
        formData.append("iconImage", iconFile);
        formData.append("coverImage", coverFile);

        toast.promise(postData(formData, token), {
            loading: "Creating Module>...",
            success: () => {
                setTimeout(() => {
                    router.push(`/dashboard`)
                }, 200)
                return `Module ${data.name} has been created`
            },
            error: (e: AxiosError<{ msg: string }>) => {
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
                                <FormLabel>Icon Image (file)</FormLabel>
                                <FormControl>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files)}
                                        className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-700 file:text-gray-100"
                                    />
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
                                <FormLabel>Cover Image (file)</FormLabel>
                                <FormControl>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files)}
                                        className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-700 file:text-gray-100"
                                    />
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
