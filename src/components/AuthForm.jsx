"use client";

// Import necessary hooks from React
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// AuthForm component definition
export default function AuthForm({ isSignup, handleSubmit }) {
  // State to manage email input
  const [email, setEmail] = useState('');
  // State to manage password input
  const [password, setPassword] = useState('');
  // State to manage feedback messages
  const [feedback, setFeedback] = useState('');

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

  const inputVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg shadow-xl p-8 w-full max-w-md"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl mb-6 text-white font-bold text-center"
      >
        {isSignup ? 'Sign Up' : 'Login'}
      </motion.h2>
      <form onSubmit={onSubmit} className="space-y-6 bg-gray-800 p-8 rounded-lg">
        <motion.div variants={inputVariants} initial="hidden" animate="visible" className="mb-4">
          <label htmlFor="email" className="block mb-2 text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </motion.div>
        <motion.div variants={inputVariants} initial="hidden" animate="visible" className="mb-6">
          <label htmlFor="password" className="block mb-2 text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </motion.div>
        <motion.button
          type="submit"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isSignup ? 'Sign Up' : 'Login'}
        </motion.button>
      </form>
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-red-500 text-center"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}