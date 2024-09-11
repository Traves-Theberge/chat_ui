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
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-6"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-navy rounded-lg shadow-xl p-8 w-full max-w-md relative overflow-hidden"
          >
            <motion.button 
              className="absolute top-6 right-6 text-light-gray hover:text-white transition-colors z-10 p-4 rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-vibrant-red"
              onClick={closeModal}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            <AuthForm isSignup={isSignup} handleSubmit={onSuccess} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}