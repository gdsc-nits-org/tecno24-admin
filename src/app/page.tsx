'use client';
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth"
import { auth } from "./utils/firebase";

export default function HomePage() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth)
  if (error) {
    return <div>There was some error. Please refresh the page or email contact@tecnoesis.co.in </div>
  }
  if (loading) {
    return <div>Loading...</div>
  }
  if (user) {
    return <div>You are signed in as {user.user.displayName}. Goto <Link href={"/dashboard"}>
      Dashboard
    </Link></div>
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Button variant={"secondary"} onClick={() => signInWithGoogle()}>Sign In</Button>
    </main>
  );
}
