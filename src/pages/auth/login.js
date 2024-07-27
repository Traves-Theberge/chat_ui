"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/chat');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <AuthForm isSignup={false} closeModal={() => {}} onSuccess={handleSuccess} />
      {feedback && <div className="mt-4 text-red-500 text-center">{feedback}</div>}
    </div>
  );
}
