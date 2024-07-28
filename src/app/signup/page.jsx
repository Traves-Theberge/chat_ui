"use client";

// Import necessary hooks and components
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import supabase from '@/utils/supabaseClient';

export default function SignupPage() {
  // State to manage feedback messages
  const [isSignupVisible, setIsSignupVisible] = useState(true);
  const [feedback, setFeedback] = useState('');
  // Router instance from Next.js
  const router = useRouter();

  // Function to handle signup
  const handleSignup = async (email, password) => {
    // Attempt to sign up with email and password
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      // Set feedback message if there's an error
      setFeedback(error.message);
    } else {
      // Redirect to chat page on successful signup
      router.push('/chat');
    }
  };

  const closeModals = () => {
    setIsSignupVisible(false);
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white p-4">
      <div className="w-full max-w-md">
        <AuthModal isSignup={true} isVisible={isSignupVisible} closeModal={closeModals} onSuccess={handleSignup} />
        {feedback && <div className="mt-4 text-red-500 text-center">{feedback}</div>}
      </div>
    </div>
  );
}