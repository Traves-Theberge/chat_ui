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
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      {/* Authentication form component */}
      <AuthForm isSignup={false} handleSubmit={handleLogin} />
      {/* Display feedback message if it exists */}
      {feedback && <div className="mt-4 text-red-500 text-center">{feedback}</div>}
    </div>
  );
}