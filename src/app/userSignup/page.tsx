"use client"

import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { env } from "~/env";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { User } from "firebase/auth";
import { toast } from "sonner";
export const runtime = "edge";

const formSchema = z.object({
    firstName: z.string().min(1, { message: "First Name is required." }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: "Last Name is required." }),
    phoneNumber: z.string().min(1, { message: "Phone Number is required." }),
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    collegeName: z.string().min(1, { message: "College Name is required." }),
    registrationId: z.string().min(1, { message: "Registration ID is required." }),
    balance: z.number().default(0),
});

async function createUser(data: z.infer<typeof formSchema>, user: User) {
    const payload = {
        email: user.email,
        firebaseId: user.uid,
        imageUrl: user.photoURL,
        ...data,
    };
    const token = await user.getIdToken();
    const response = await axios.post(`${env.NEXT_PUBLIC_API_URL}/api/auth/signup`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response
}

const CompleteProfile = () => {
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            phoneNumber: "",
            username: "",
            collegeName: "",
            registrationId: "",
            balance: 0,
        },
    });
    const { handleSubmit, control, formState: { errors } } = form;
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (user) {
            toast.promise(createUser(data, user), {
                success: () => {
                    setTimeout(() => {
                        router.push("/dashboard")
                    }, 200)
                    return "User Created Successfully"
                },
                loading: "Creating User...",
                error: (e) => {
                    return e.response.data.msg
                }
            })
        }
    };

    if (loading) {
        return (
          <div className="flex w-screen h-screen justify-center items-center gap-3">
            <Spinner size="large" />
          </div>
        )
    }

    return (
        <div className="py-2 flex flex-col gap-10 min-h-screen items-center justify-center bg-gray-900">
            <div className="flex flex-row justify-center items-center w-full text-4xl font-mono font-bold uppercase py-8 my-10 text-center">Complete Your profile</div>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
                    <FormField
                        control={control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
                                </FormControl>
                                <FormMessage>{errors.firstName?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Middle Name" {...field} />
                                </FormControl>
                                <FormMessage>{errors.middleName?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>
                                <FormMessage>{errors.lastName?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Phone Number" {...field} />
                                </FormControl>
                                <FormMessage>{errors.phoneNumber?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage>{errors.username?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="collegeName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>College Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="College Name" {...field} />
                                </FormControl>
                                <FormMessage>{errors.collegeName?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="registrationId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Registration ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Registration ID" {...field} />
                                </FormControl>
                                <FormMessage>{errors.registrationId?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default CompleteProfile;