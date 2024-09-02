'use client';
import Link from "next/link";
import { useRouter } from 'next/navigation'; 
import { Button } from '~/components/ui/button';
import { Spinner } from "~/components/ui/spinner";
import { useSignInWithGoogle, useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './utils/firebase';
import { useEffect } from 'react';

export default function HomePage() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [_user, _loading, _error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const checkUserFirstTime = () => {
      if (user) {
        try {
          const metadata = _user?.metadata;
          const isFirstTime = metadata?.creationTime === metadata?.lastSignInTime;

          if (isFirstTime) {
             router.push('/userSignup');
          } else {
             router.push('/dashboard'); 
          }
        } catch (error) {
          console.error('Error checking user:', error);
        }
      }
    };

    checkUserFirstTime();
  }, [user, router]); 

  if (error) {
    return (
      <div>
        There was some error. Please refresh the page or email contact@tecnoesis.co.in
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center gap-3">
        <Spinner size="large" />
      </div>
    )
  }
  if (user) {
    router.push("/dashboard");
    return;
  }
  if(!_user)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-xl my-2">Tecnoesis 2024 Admin Panel. Please Sign In to continue</h1>
      <Button variant={"secondary"} onClick={() => signInWithGoogle()}>
        Sign In
      </Button>
    </main>
  );
  else{
    router.push('/dashboard');
  }
}
