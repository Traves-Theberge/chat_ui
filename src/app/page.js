"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import supabase from '@/utils/supabaseClient';

export default function HomePage() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const router = useRouter();

  const closeModals = () => {
    setIsLoginVisible(false);
    setIsSignupVisible(false);
  };

  const handleSuccess = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error.message);
    } else {
      closeModals();
      router.push('/chat');
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (event === 'SIGNED_IN' && session) {
        router.push('/chat');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]); // Added router to the dependency array

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg">
        <h1 className="text-2xl mb-6 text-center">Welcome to Chatbot</h1>
        <button
          className="w-full p-2 bg-pink-500 text-white rounded block text-center"
          onClick={() => setIsLoginVisible(true)}
        >
          Login
        </button>
        <button
          className="w-full p-2 bg-pink-500 text-white rounded block text-center mt-4"
          onClick={() => router.push('/signup')}
        >
          Sign Up
        </button>
      </div>
      <AuthModal isSignup={false} isVisible={isLoginVisible} closeModal={closeModals} onSuccess={handleSuccess} />
    </div>
  );
}