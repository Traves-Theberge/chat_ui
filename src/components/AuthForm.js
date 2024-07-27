"use client";

import { useState } from 'react';

export default function AuthForm({ isSignup, closeModal, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/auth/${isSignup ? 'signup' : 'login'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        closeModal();
        onSuccess();
      } else {
        setFeedback(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setFeedback('An error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg">
      <h2 className="text-xl mb-4 text-center">{isSignup ? 'Sign Up' : 'Login'}</h2>
      {feedback && <div className="mb-4 text-center text-red-500">{feedback}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          placeholder="Password"
          required
        />
        <button type="submit" className="w-full p-2 bg-pink-500 text-white rounded">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      {isSignup && (
        <div className="mt-4 text-center">
          <span className="text-gray-400">
            Already have an account?{' '}
            <button onClick={closeModal} className="text-pink-500">
              Login
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
