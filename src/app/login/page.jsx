"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import useAuth from '@/hooks/useAuth';
import supabase from '@/utils/supabaseClient';

// This is the login page component
export default function LoginPage() {
  // State to manage the feedback message
  const [feedback, setFeedback] = useState('');
  // State to manage the loading status
  const [isLoading, setIsLoading] = useState(false);
  // Router instance from Next.js
  const router = useRouter();
  // Auth hook instance
  const { session } = useAuth();

  // Function to handle the login process
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

  // Effect to redirect to the chat page if the user is already logged in
  useEffect(() => {
    if (session) {
      router.push('/chat');
    }
  }, [session, router]);

  // Render the login page
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md">
        <AuthForm isSignup={false} handleSubmit={handleLogin} isLoading={isLoading} />
        {feedback && <div className="mt-4 text-red-500 text-center">{feedback}</div>}
      </div>
    </div>
  );
}