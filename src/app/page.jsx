"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white p-4"
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
          className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg shadow-xl p-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full p-3 bg-pink-600 text-white rounded-lg font-semibold mb-4 transition duration-300 ease-in-out transform hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            onClick={() => setIsLoginVisible(true)}
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full p-3 bg-purple-600 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
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