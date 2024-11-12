"use client";
import React, { useEffect } from 'react';
import InputForm from '../components/inputForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TransactionData from '../components/transactiondata';

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Perform the redirect in a useEffect hook
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return null; // Optionally, render nothing until redirect is completed
  }

  return (
    <div>
      <InputForm />
      <TransactionData />
    </div>
  );
};

export default Page;
