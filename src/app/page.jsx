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
import { RotatingLines } from "react-loader-spinner";

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

  // Render a loading spinner if the auth hook is still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    );
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
      role="main"
      aria-label="Home page"
    >
      <div className="w-full max-w-md">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/6446aa0f3ea6fc51c7c3cd24_Lonestar Solar Services Logo-p-1600.png"
              alt="Lonestar Solar Services Logo"
              width={400}
              height={200}
              className="mx-auto mb-4 z-10 relative"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <div className="absolute inset-0 bg-vibrant-red opacity-20 filter blur-xl z-0 animate-pulse" aria-hidden="true"></div>
          </motion.div>
          <motion.p
            className="text-light-gray font-sans font-light mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            AI-Powered Sales Training Companion
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`bg-[#1A1A1A] bg-opacity-50 backdrop-blur-lg rounded-none shadow-xl p-8`}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(240, 53, 53, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 px-4 bg-vibrant-red text-light-gray rounded-none font-semibold mb-4 transition duration-300 ease-in-out transform hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-vibrant-red focus:ring-opacity-50 shadow-md`}
            onClick={() => setIsLoginVisible(true)}
            aria-label="Open login modal"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(42, 42, 42, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 px-4 bg-[#2A2A2A] text-light-gray rounded-none font-semibold transition duration-300 ease-in-out transform hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-vibrant-red focus:ring-opacity-50 shadow-md`}
            onClick={() => router.push('/signup')}
            aria-label="Navigate to sign up page"
          >
            Sign Up
          </motion.button>
        </motion.div>
      </div>
      <AuthModal isSignup={false} isVisible={isLoginVisible} closeModal={closeModals} onSuccess={handleSuccess} />
    </motion.div>
  );
}