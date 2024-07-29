"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AuthModal from '@/components/AuthModal';
import useAuth from '@/hooks/useAuth';
import supabase from '@/utils/supabaseClient';

export default function HomePage() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.push('/chat');
      }
    }
  }, [session, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const closeModals = () => {
    setIsLoginVisible(false);
    setIsSignupVisible(false);
  };

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-center min-h-screen bg-gray-900 text-white p-4`}
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome to Chat UI</h1>
          <p className="text-gray-300">Your AI-powered conversation companion</p>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg shadow-xl p-8`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full p-3 bg-blue-500 text-white rounded-lg font-semibold mb-4 transition duration-300 ease-in-out transform hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            onClick={() => setIsLoginVisible(true)}
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full p-3 bg-purple-600 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
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