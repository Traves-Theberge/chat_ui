"use client";

import { useState } from 'react';

export default function AuthForm({ isSignup, handleSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');
    if (typeof handleSubmit !== 'function') {
      console.error('handleSubmit is not a function');
      setFeedback('An error occurred. Please try again.');
      return;
    }
    try {
      await handleSubmit(email, password);
    } catch (error) {
      setFeedback(error.message);
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
      <h2 className="text-2xl mb-4">{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-pink-500 text-white rounded">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      {feedback && <div className="mt-4 text-red-500">{feedback}</div>}
    </div>
  );
}