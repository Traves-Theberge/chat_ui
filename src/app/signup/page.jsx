"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import supabase from '@/utils/supabaseClient';

export default function SignupPage() {
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  const handleSignup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setFeedback(error.message);
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <AuthForm isSignup={true} handleSubmit={handleSignup} />
      {feedback && <div className="mt-4 text-red-500 text-center">{feedback}</div>}
    </div>
  );
}