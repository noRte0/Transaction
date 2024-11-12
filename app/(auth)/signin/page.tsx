"use client"
import React from 'react'
import SignInButton from '@/app/components/google_sign_in_button'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const signin = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/");
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h6 className='mb-4 font-extrabold text-white text-xl  flex items-center justify-center pt-5'>SIGN IN</h6>
        <div className='flex items-center justify-center pb-6'><SignInButton /></div>
    </div>
  )
}

export default signin