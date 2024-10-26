"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useSignInWithGoogle, useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./utils/firebase";
import { useEffect } from "react";
import axios from "axios";
import { env } from "~/env";
import { toast } from "sonner";

interface UserResponse {
  username: string;
}

export default function HomePage() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [_user, _loading, _error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const checkUserFirstTime = async () => {
      if (_user) {
        try {
          const token = _user.getIdToken();
          const res = await axios.get<{ msg: UserResponse }>(
            `${env.NEXT_PUBLIC_API_URL}/api/user/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          router.push("/dashboard");
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.status === 404) {
              router.push("/userSignup");
            }
          } else {
            toast.error("Create User");
            console.error("Error checking user:", error);
          }
        }
      }
    };

    void checkUserFirstTime();
  }, [user, router, _user]);

  if (error) {
    return (
      <div>
        There was some error. Please refresh the page or email
        contact@tecnoesis.co.in
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center gap-3">
        <Spinner size="large" />
      </div>
    );
  }
  if (user) {
    router.push("/dashboard");
    return;
  }
  if (!_user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="my-2 text-xl">
          Tecnoesis 2024 Admin Panel. Please Sign In to continue
        </h1>
        <Button variant={"secondary"} onClick={() => signInWithGoogle()}>
          Sign In
        </Button>
      </main>
    );
  } else {
    router.push("/dashboard");
    console.log(_user?.metadata);
  }
}
