"use client";

// Import necessary hooks and components
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import supabase from '@/utils/supabaseClient';

export default function HomePage() {
  // State to manage the visibility of login modal
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  // State to manage the visibility of signup modal
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  // Router instance from Next.js
  const router = useRouter();

  // Function to close both modals
  const closeModals = () => {
    setIsLoginVisible(false);
    setIsSignupVisible(false);
  };

  // Function to handle successful login
  const handleSuccess = async (email, password) => {
    // Attempt to sign in with email and password
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Log error message if there's an error
      console.error('Login error:', error.message);
    } else {
      // Close modals and redirect to chat page on successful login
      closeModals();
      router.push('/chat');
    }
  };

  // Effect to handle authentication state changes
  useEffect(() => {
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        // Redirect to login page on sign out
        router.push('/login');
      } else if (event === 'SIGNED_IN' && session) {
        // Redirect to chat page on sign in
        router.push('/chat');
      }
    });

    // Cleanup the listener on component unmount
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
      {/* Authentication modal component */}
      <AuthModal isSignup={false} isVisible={isLoginVisible} closeModal={closeModals} onSuccess={handleSuccess} />
    </div>
  );
}