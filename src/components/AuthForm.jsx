"use client";

// Import necessary hooks from React
import { useState } from 'react';

// AuthForm component definition
export default function AuthForm({ isSignup, handleSubmit }) {
  // State to manage email input
  const [email, setEmail] = useState('');
  // State to manage password input
  const [password, setPassword] = useState('');
  // State to manage feedback messages
  const [feedback, setFeedback] = useState('');

  // Function to handle form submission
  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setFeedback(''); // Clear any existing feedback messages
    if (typeof handleSubmit !== 'function') {
      // Check if handleSubmit is a function
      console.error('handleSubmit is not a function'); // Log error if handleSubmit is not a function
      setFeedback('An error occurred. Please try again.'); // Set feedback message
      return; // Exit the function
    }
    try {
      // Attempt to call handleSubmit with email and password
      await handleSubmit(email, password);
    } catch (error) {
      // Catch any errors during handleSubmit
      setFeedback(error.message); // Set feedback message to error message
      console.error('Auth error:', error); // Log the error
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
      <h2 className="text-2xl mb-4">{isSignup ? 'Sign Up' : 'Login'}</h2> {/* Display form title based on isSignup prop */}
      <form onSubmit={onSubmit}> {/* Form submission handler */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label> {/* Email input label */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state on input change
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label> {/* Password input label */}
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-pink-500 text-white rounded">
          {isSignup ? 'Sign Up' : 'Login'} {/* Button text based on isSignup prop */}
        </button>
      </form>
      {feedback && <div className="mt-4 text-red-500">{feedback}</div>} {/* Display feedback message if it exists */}
    </div>
  );
}