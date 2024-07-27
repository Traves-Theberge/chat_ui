"use client";

import AuthForm from './AuthForm';

export default function AuthModal({ isSignup, isVisible, closeModal, onSuccess }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <button className="text-white mb-4" onClick={closeModal}>X</button>
        <AuthForm isSignup={isSignup} closeModal={closeModal} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
