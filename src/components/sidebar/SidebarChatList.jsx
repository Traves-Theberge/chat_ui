// SidebarChatList.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarChatItem from './SidebarChatItem';

const SidebarChatList = ({ isLoading, isCollapsed, chats, currentChat, setCurrentChat, handleDeleteChat, isMessageLoading }) => {
  return (
    <div className="flex-grow overflow-y-auto">
      <div className="p-4 space-y-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : Array.isArray(chats) && chats.length > 0 ? (
          <AnimatePresence>
            {chats.map((chat) => (
              <SidebarChatItem
                key={chat.id}
                chat={chat}
                isCollapsed={isCollapsed}
                isActive={currentChat === chat.id}
                onClick={() => !isMessageLoading && setCurrentChat(chat.id)}
                onDelete={() => handleDeleteChat(chat.id)}
                isDisabled={isMessageLoading}
              />
            ))}
          </AnimatePresence>
        ) : !isCollapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-400"
          >
            No chat sessions available.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default SidebarChatList;