// SidebarChatItem.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faComment } from '@fortawesome/free-solid-svg-icons';

const SidebarChatItem = ({ chat, isCollapsed, isActive, onClick, onDelete, isDisabled }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      onClick={isDisabled ? undefined : onClick}
      className={`p-2 rounded-lg cursor-pointer transition duration-200 flex justify-between items-center h-12 
        ${isActive 
          ? 'bg-vibrant-red text-light-gray' 
          : 'bg-navy hover:bg-opacity-80 text-light-gray'
        } 
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        border border-light-gray border-opacity-20`}
    >
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div
            key="icon"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faComment} className="text-xl" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center w-full"
          >
            <span className="truncate flex-grow">{chat.session_name}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-light-gray hover:text-vibrant-red transition duration-200 ml-2"
            >
              <FontAwesomeIcon icon={faTrash} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SidebarChatItem;