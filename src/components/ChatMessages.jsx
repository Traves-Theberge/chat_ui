"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import useChatStore from '@/store/chatStore';

export default function ChatMessages({ messages, isLoading, isAiResponding }) {
  const { deleteMessage, fetchMessages, currentChat, subscribeToMessages, clearPendingResponse } = useChatStore(state => ({
    deleteMessage: state.deleteMessage,
    fetchMessages: state.fetchMessages,
    currentChat: state.currentChat,
    subscribeToMessages: state.subscribeToMessages,
    clearPendingResponse: state.clearPendingResponse
  }));

  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat);
      const unsubscribe = subscribeToMessages(currentChat);
      return () => {
        if (unsubscribe) unsubscribe();
        if (clearPendingResponse) clearPendingResponse(currentChat);
      };
    }
  }, [currentChat, fetchMessages, subscribeToMessages, clearPendingResponse]);

  const groupedMessages = useMemo(() => {
    const grouped = [];
    let currentGroup = [];
    messages.forEach((message, index) => {
      if (index === 0 || message.sender !== messages[index - 1].sender) {
        if (currentGroup.length > 0) {
          grouped.push(currentGroup);
        }
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    if (currentGroup.length > 0) {
      grouped.push(currentGroup);
    }
    return grouped;
  }, [messages]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupedMessages, isAiResponding]);

  useEffect(() => {
    console.log('Messages in ChatMessages:', messages);
    console.log('Grouped messages:', groupedMessages);
  }, [messages, groupedMessages]);

  return (
    <div className="flex flex-col flex-grow overflow-y-auto p-4 overflow-x-hidden bg-navy">
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-vibrant-red" />
        </div>
      )}
      <AnimatePresence>
        {groupedMessages.map((group, groupIndex) => (
          <motion.div
            key={groupIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageGroup messages={group} />
          </motion.div>
        ))}
      </AnimatePresence>
      {isAiResponding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-start mb-4"
        >
          <div className="bg-navy border border-light-gray border-opacity-20 text-light-gray rounded-lg p-3">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

function MessageGroup({ messages }) {
  const sender = messages[0].sender;
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="flex flex-col">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} isGrouped={index !== 0} />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, isGrouped }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const deleteMessage = useChatStore(state => state.deleteMessage);
  const copyMessage = useChatStore(state => state.copyMessage);

  const processedContent = useMemo(() => {
    if (message.file) {
      return `File: ${message.file.filename}\n\n${message.content}`;
    }
    return message.content;
  }, [message.content, message.file]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    await deleteMessage(message.id);
    setShowMenu(false);
  };

  const handleCopy = () => {
    copyMessage(message);
    setShowMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl rounded-2xl p-6 
        ${message.sender === 'user' 
          ? 'bg-vibrant-red text-light-gray self-end' 
          : 'bg-navy border border-light-gray border-opacity-20 text-light-gray self-start'} 
        shadow-lg 
        ${isGrouped ? 'mt-2' : 'mt-4'}`}
    >
      <ReactMarkdown
        className="text-sm md:text-base leading-relaxed break-words mb-4"
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} bg-gray-800 rounded px-1`} {...props}>
                {children}
              </code>
            );
          },
          p: ({ children }) => <p className="mb-2">{children}</p>,
          ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
      <div className="flex justify-between items-center mt-3">
        <p className="text-xs opacity-70 mr-2">
          {message.sender === 'user' ? 'You' : 'AI'}
        </p>
        <p className="text-xs opacity-70 ml-2">
          {new Date(message.created_at).toLocaleTimeString()}
        </p>
      </div>
      <div className="absolute top-2 right-2">
        <motion.button
          onClick={() => setShowMenu(!showMenu)}
          className="text-xs p-2 rounded-full text-light-gray"
          style={{ backgroundColor: 'transparent' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </motion.button>
        <AnimatePresence>
          {showMenu && (
            <motion.div
              ref={menuRef}
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-navy ring-1 ring-white ring-opacity-5" // Added white outline
              style={{
                zIndex: 10,
                top: '100%',
                right: 0,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  onClick={handleCopy}
                  className="flex items-center px-4 py-2 text-sm text-light-gray hover:bg-vibrant-red hover:bg-opacity-20 w-full text-left"
                  role="menuitem"
                >
                  <FontAwesomeIcon icon={faCopy} className="mr-3" /> Copy
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 text-sm text-light-gray hover:bg-vibrant-red hover:bg-opacity-20 w-full text-left"
                  role="menuitem"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-3" /> Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}