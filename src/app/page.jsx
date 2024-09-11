// This is the home page component
"use client";

// Import necessary hooks and components
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AuthModal from '@/components/AuthModal';
import useAuth from '@/hooks/useAuth';
import supabase from '@/utils/supabaseClient';
import Image from 'next/image';

// Define the home page component
export default function HomePage() {
  // State to manage the visibility of the login modal
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  // State to manage the visibility of the signup modal
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  // Router instance from Next.js
  const router = useRouter();
  // Auth hook instance
  const { session, loading } = useAuth();

  // Effect to redirect to the chat page if the user is already logged in
  useEffect(() => {
    if (!loading) {
      if (session) {
        router.push('/chat');
      }
    }
  }, [session, loading, router]);

  // Render a loading message if the auth hook is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Function to close the modals
  const closeModals = () => {
    setIsLoginVisible(false);
    setIsSignupVisible(false);
  };

  // Function to handle the login process
  const handleSuccess = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Login error:', error.message);
        throw error;
      } else {
        closeModals();
        router.push('/chat');
      }
    } catch (error) {
      console.error('Auth error:', error);
      // You might want to set some state here to display the error to the user
    }
  };

  // Render the home page
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-center min-h-screen bg-navy text-light-gray p-4`}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/6446aa0f3ea6fc51c7c3cd24_Lonestar Solar Services Logo-p-1600.png"
            alt="Lonestar Solar Services Logo"
            width={400}
            height={200}
            className="mx-auto mb-4"
          />
          <p className="text-light-gray font-sans font-light">AI-powered Sales Training companion</p>
        </div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`bg-[#1A1A1A] bg-opacity-50 backdrop-blur-lg rounded-lg shadow-xl p-8`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full p-3 bg-vibrant-red text-light-gray rounded-lg font-semibold mb-4 transition duration-300 ease-in-out transform hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-vibrant-red focus:ring-opacity-50`}
            onClick={() => setIsLoginVisible(true)}
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full p-3 bg-[#2A2A2A] text-light-gray rounded-lg font-semibold transition duration-300 ease-in-out transform hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-vibrant-red focus:ring-opacity-50`}
            onClick={() => router.push('/signup')}
          >
            Sign Up
          </motion.button>
        </motion.div>
      </div>
      <AuthModal isSignup={false} isVisible={isLoginVisible} closeModal={closeModals} onSuccess={handleSuccess} />
    </motion.div>
  );
}