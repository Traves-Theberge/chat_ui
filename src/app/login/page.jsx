"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import useAuth from '@/hooks/useAuth';
import supabase from '@/utils/supabaseClient';

export default function LoginPage() {
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { session } = useAuth();

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setFeedback(error.message);
      } else {
        router.push('/chat');
      }
    } catch (error) {
      setFeedback('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      router.push('/chat');
    }
  }, [session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md">
        <AuthForm isSignup={false} handleSubmit={handleLogin} isLoading={isLoading} />
        {feedback && <div className="mt-4 text-red-500 text-center">{feedback}</div>}
      </div>
    </div>
  );
}