"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatMessages({ messages, isLoading, isAiResponding }) {
  const [groupedMessages, setGroupedMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const groupMessages = () => {
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
      setGroupedMessages(grouped);
    };

    groupMessages();
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupedMessages, isAiResponding]);

  return (
    <div className="flex flex-col flex-grow overflow-y-auto p-4 overflow-x-hidden">
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400" />
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
          <div className="bg-gray-700 text-white rounded-lg p-3">
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
  const [showActions, setShowActions] = useState(false);

  const processedContent = useMemo(() => {
    if (message.file) {
      return `File: ${message.file.filename}\n\n${message.content}`;
    }
    return message.content;
  }, [message.content, message.file]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl rounded-2xl p-4 
        ${message.sender === 'user' 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white self-end' 
          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white self-start'} 
        shadow-lg 
        ${isGrouped ? 'mt-1' : 'mt-3'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <ReactMarkdown
        className="text-sm md:text-base leading-relaxed break-words"
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
      {showActions && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button onClick={() => navigator.clipboard.writeText(message.content)} className="text-xs bg-gray-800 p-1 rounded">Copy</button>
        </div>
      )}
    </motion.div>
  );
}