"use client"; // Indicates that this file is a client-side module

import { useState, useRef, useEffect, useCallback } from 'react'; // Import the useState, useRef, useEffect, and useCallback hooks from React
import debounce from 'lodash/debounce'; // Import the debounce function from Lodash
import EmojiPicker from 'emoji-picker-react'; // Import the EmojiPicker component
import { motion, AnimatePresence } from 'framer-motion';

// Define the MessageInput component
export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState(''); // State to manage the input message
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

  // Debounced function to send the message
  const debouncedSendMessage = useCallback(
    debounce((msg) => {
      onSendMessage(msg);
    }, 300),
    [onSendMessage]
  );

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (message.trim()) { // Check if the message is not empty
      debouncedSendMessage(message); // Call the debounced function with the message
      setMessage(''); // Clear the input field
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="p-8 border-t border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex items-center space-x-2">
        <motion.button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          😊
        </motion.button>
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              className="absolute bottom-full mb-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          rows={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </motion.button>
      </div>
    </motion.form>
  );
}