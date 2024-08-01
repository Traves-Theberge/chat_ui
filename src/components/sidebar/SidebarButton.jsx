// SidebarButton.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SidebarButton = ({ onClick, icon, text, isCollapsed, className }) => {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={`w-full ${className} text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-10`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!isCollapsed && (
          <motion.span
            key={`${text}-text`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
      <FontAwesomeIcon icon={icon} className={`text-lg ${isCollapsed ? 'mx-auto' : ''}`} style={{ width: '1em', height: '1em' }} />
    </motion.button>
  );
};

export default SidebarButton;