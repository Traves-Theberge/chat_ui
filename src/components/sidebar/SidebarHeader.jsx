// SidebarHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SidebarHeader = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <div className="p-4 flex justify-between items-center h-16">
      {!isCollapsed && (
        <h1 className="text-xl font-semibold truncate">Chat History</h1>
      )}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`text-white hover:bg-gray-700 p-2 rounded-full transition-colors duration-200 ${isCollapsed ? 'mx-auto' : ''}`}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        )}
      </motion.button>
    </div>
  );
};

export default SidebarHeader;