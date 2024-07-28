"use client"; // Indicates that this file is a client-side module

import AuthForm from './AuthForm'; // Import the AuthForm component

// Define the AuthModal component
export default function AuthModal({ isSignup, isVisible, closeModal, onSuccess }) {
  // If the modal is not visible, return null (do not render anything)
  if (!isVisible) return null;

  // Render the modal
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Close button for the modal */}
        <button className="text-white mb-4" onClick={closeModal}>X</button>
        {/* Render the AuthForm component */}
        <AuthForm isSignup={isSignup} handleSubmit={onSuccess} />
      </div>
    </div>
  );
}