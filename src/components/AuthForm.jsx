"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AuthForm({ 
  isSignup, 
  handleSubmit, 
  handlePasswordReset, 
  isLoading, 
  rememberMe, 
  setRememberMe, 
  feedback 
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (showResetPassword) {
      if (typeof handlePasswordReset === 'function') {
        handlePasswordReset(email);
      } else {
        console.error('handlePasswordReset is not a function');
      }
    } else {
      handleSubmit(email, password);
    }
  };

  const inputVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 0 15px rgba(240, 53, 53, 0.5)' },
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
      className="bg-navy rounded-lg shadow-xl p-8 w-full max-w-md"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl mb-6 text-light-gray font-bold text-center"
        id="form-title"
      >
        {isSignup ? 'Sign Up' : 'Login'}
      </motion.h2>
      <form onSubmit={onSubmit} className="space-y-4 bg-[#1A1A1A] p-8 rounded-lg" aria-labelledby="form-title">
        <motion.div variants={inputVariants} initial="hidden" animate="visible" className="mb-4">
          <label htmlFor="email" className="block mb-2 text-light-gray">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-[#2A2A2A] text-light-gray focus:outline-none focus:ring-2 focus:ring-vibrant-red transition"
            aria-required="true"
          />
        </motion.div>
        {!showResetPassword && (
          <motion.div variants={inputVariants} initial="hidden" animate="visible" className="mb-6">
            <label htmlFor="password" className="block mb-2 text-light-gray">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-[#2A2A2A] text-light-gray focus:outline-none focus:ring-2 focus:ring-vibrant-red transition"
              aria-required="true"
            />
          </motion.div>
        )}
        <motion.button
          type="submit"
          variants={buttonVariants}
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(240, 53, 53, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 px-4 border border-transparent rounded-none shadow-sm text-sm font-medium text-light-gray bg-vibrant-red hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vibrant-red transition-all duration-300"
          aria-label={isLoading ? 'Processing' : (showResetPassword ? 'Reset Password' : (isSignup ? 'Sign Up' : 'Login'))}
        >
          {isLoading ? 'Processing...' : (showResetPassword ? 'Reset Password' : (isSignup ? 'Sign Up' : 'Login'))}
        </motion.button>
      </form>
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-vibrant-red text-center"
            role="alert"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
      {!isSignup && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => {
                if (typeof setRememberMe === 'function') {
                  setRememberMe(e.target.checked);
                }
              }}
              className="mr-2"
              aria-label="Remember me"
            />
            <label htmlFor="rememberMe" className="text-sm text-light-gray">Remember me</label>
          </div>
          <button
            type="button"
            onClick={() => setShowResetPassword(!showResetPassword)}
            className="text-sm text-vibrant-red hover:underline"
            aria-label={showResetPassword ? 'Back to Login' : 'Forgot Password'}
          >
            {showResetPassword ? 'Back to Login' : 'Forgot Password?'}
          </button>
        </div>
      )}
    </motion.div>
  );
}