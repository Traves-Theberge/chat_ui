// SidebarNewChatModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const SidebarNewChatModal = ({ isOpen, onClose, newChatName, setNewChatName, handleCreateChat }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCreateChat(newChatName);
    }
  };

  const handleCreate = () => {
    handleCreateChat(newChatName);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 p-8 rounded-xl shadow-2xl relative max-w-md w-full"
          >
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-10 h-10 flex items-center justify-center rounded-full"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
            <div onKeyDown={handleKeyDown}>
              <h2 className="text-3xl font-bold mb-6 text-white">Create New Chat</h2>
              <input
                type="text"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                placeholder="Enter chat name"
                className="w-full p-3 border text-white bg-gray-700 border-gray-600 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                onClick={handleCreate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
              >
                Create Chat
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarNewChatModal;