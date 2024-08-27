"use client";
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../utils/firebase"

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
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
  return (
    <div>Dashboard Page. Signed in as {user?.displayName} </div>
  )
}