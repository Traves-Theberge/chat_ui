"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';

export default function HomePage() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const router = useRouter();

  const closeModals = () => {
    setIsLoginVisible(false);
    setIsSignupVisible(false);
  };

  const handleSuccess = () => {
    closeModals();
    router.push('/chat');
  };

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
          onClick={() => setIsSignupVisible(true)}
        >
          Sign Up
        </button>
      </div>
      <AuthModal isSignup={false} isVisible={isLoginVisible} closeModal={closeModals} onSuccess={handleSuccess} />
      <AuthModal isSignup={true} isVisible={isSignupVisible} closeModal={closeModals} onSuccess={handleSuccess} />
    </div>
  );
}
