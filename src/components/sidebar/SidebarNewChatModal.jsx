// SidebarNewChatModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const SidebarNewChatModal = ({ isOpen, onClose, newChatName, setNewChatName, handleCreateChat }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCreateChat();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-lg shadow-xl relative max-w-md w-full"
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-300 hover:text-white transition-colors z-10 p-2 rounded-full bg-gray-700 bg-opacity-60 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
            <div onKeyDown={handleKeyDown}>
              <h2 className="text-2xl font-bold mb-4 text-white">Create New Chat</h2>
              <input
                type="text"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                placeholder="Enter chat name"
                className="w-full p-3 border text-white bg-gray-700 border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreateChat}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarNewChatModal;