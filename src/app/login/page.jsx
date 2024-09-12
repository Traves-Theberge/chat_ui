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
  // State to manage remembering credentials
  const [rememberMe, setRememberMe] = useState(false);
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
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          // Note: Storing passwords in localStorage is not secure.
          // Consider using a more secure method or only storing the email.
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        router.push('/chat');
      }
    } catch (error) {
      setFeedback('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle password reset
  const handlePasswordReset = async (email) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setFeedback(error.message);
      } else {
        setFeedback('Password reset email sent. Please check your inbox.');
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
    <div className="flex items-center justify-center min-h-screen bg-navy text-light-gray p-4">
      <div className="w-full max-w-md">
        <AuthForm 
          isSignup={false} 
          handleSubmit={handleLogin} 
          handlePasswordReset={handlePasswordReset}
          isLoading={isLoading} 
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          feedback={feedback}
        />
      </div>
    </div>
  );
}