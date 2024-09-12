"use client"; 

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from './AuthForm'; 


export default function AuthModal({ isSignup, isVisible, closeModal, onSuccess }) {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.4, 
        ease: [0.6, -0.05, 0.01, 0.99] 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20, 
      transition: { 
        duration: 0.3, 
        ease: [0.6, -0.05, 0.01, 0.99] 
      } 
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-navy rounded-none shadow-xl p-8 w-full max-w-md relative overflow-hidden"
          >
            <div className="absolute top-6 right-6 flex space-x-2">
              <motion.button 
                className="text-light-gray hover:text-white transition-colors z-10 p-2 rounded-none bg-[#1A1A1A] hover:bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-vibrant-red"
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            <h2 id="modal-title" className="sr-only">{isSignup ? 'Sign Up' : 'Login'}</h2>
            <AuthForm isSignup={isSignup} handleSubmit={onSuccess} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}