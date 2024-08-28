'use client';
import Link from "next/link";
import { useRouter } from 'next/navigation'; 
import { Button } from '~/components/ui/button';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from './utils/firebase';
import { useEffect } from 'react';


export default function HomePage() {
  interface User {
    firebaseId: string;
  }
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const router = useRouter();
  useEffect(() => {
    const checkUserFirstTime = async () => {
      if (user) {
        try {
          const idToken = await user.user.getIdToken();
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
          });
  
          if (!response.ok) {
            // Log response status and message
            const errorData = await response.text();
            throw new Error(`Network response was not ok. Status: ${response.status}. Message: ${errorData}`);
          }
  
          const users = await response.json();
          const userExists = users.some((existingUser: User) => existingUser.firebaseId === idToken);
  
          if (userExists) {
            router.push('/dashboard');
          } else {
            router.push('/form');
          }
        } catch (error) {
          console.error('Error checking user in DB:', error);
          // Optionally, handle the error in the UI
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
    return <div>Loading...</div>;
  }
  if (user) {
    return (
      <div>
        You are signed in as {user.user.displayName}. <Link href={"/dashboard"}>
      Dashboard
    </Link>
      </div>
    );
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Button variant={"secondary"} onClick={() => signInWithGoogle()}>
        Sign In
      </Button>
    </main>
  );
}
