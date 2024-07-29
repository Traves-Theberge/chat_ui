"use client";

// Import necessary hooks and components
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import useAuth from '@/hooks/useAuth';
import supabase from '@/utils/supabaseClient';

export default function SignupPage() {
  // State to manage feedback messages
  const [feedback, setFeedback] = useState('');
  // State to manage loading state
  const [isLoading, setIsLoading] = useState(false);
  // Router instance from Next.js
  const router = useRouter();
  const { session } = useAuth();

  // Function to handle signup
  const handleSignup = async (email, password) => {
    // Set loading state to true
    setIsLoading(true);
    try {
      // Attempt to sign up with email and password
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        // Set feedback message if there's an error
        setFeedback(error.message);
      } else {
        // Redirect to chat page on successful signup
        router.push('/chat');
      }
    } catch (error) {
      // Set feedback message if there's an unexpected error
      setFeedback('An unexpected error occurred. Please try again.');
    } finally {
      // Set loading state to false
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
        <AuthForm isSignup={true} handleSubmit={handleSignup} isLoading={isLoading} />
        {feedback && <div className="mt-4 text-red-500 text-center">{feedback}</div>}
      </div>
    </div>
  );
}