"use client";

// Import useState hook from React
import { useState, useEffect } from 'react';

const ModalComponent = ({ isOpen, onClose, onSubmit, children }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && isOpen) {
        onSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onSubmit]);

  if (!isOpen && !isClosing) return null;

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match this with the CSS transition time
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50" onClick={closeModal}></div>
      <div className={`relative bg-gray-700 rounded-lg shadow-xl transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`} style={{ maxWidth: '90%', width: '500px' }}>
        <div className="p-6 text-white">
          {children}
        </div>
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ModalComponent;