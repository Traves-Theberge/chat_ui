"use client";

// Import necessary hooks and components
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import supabase from '@/utils/supabaseClient';

export default function LoginPage() {
  // State to manage feedback messages
  const [feedback, setFeedback] = useState('');
  // Router instance from Next.js
  const router = useRouter();

  // Function to handle login
  const handleLogin = async (email, password) => {
    // Attempt to sign in with email and password
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Set feedback message if there's an error
      setFeedback(error.message);
    } else {
      // Redirect to chat page on successful login
      router.push('/chat');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white p-4">
      <div className="w-full max-w-md">
        <AuthForm isSignup={false} handleSubmit={handleLogin} />
        {feedback && <div className="mt-4 text-red-500 text-center">{feedback}</div>}
      </div>
    </div>
  );
}