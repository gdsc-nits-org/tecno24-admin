"use client";
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../utils/firebase"
import { Button } from '~/components/ui/button';
import { useSignOut } from 'react-firebase-hooks/auth';
import { redirect } from "next/navigation";
export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [signOut, ll, err] = useSignOut(auth);
  if (error) {
    return <div>There was some error. Please contact support</div>
  }
  if (loading) {
    return (
      <div>
        Dashboard Page.
        Loading User...
      </div>
    )
  }
  if(user)
  return (
    <main className='flex flex-col justify-center items-center gap-10'>
      <div>Dashboard Page. Signed in as {user?.displayName} </div>
      <Button variant={"secondary"} onClick={() => signOut()}>Sign Out</Button>
    </main>
  )
  else{
    redirect("/");
  }
  
}
