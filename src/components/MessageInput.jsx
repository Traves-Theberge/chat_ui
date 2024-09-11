"use client"; // Indicates that this file is a client-side module

// Import necessary hooks and components from React and other libraries
import { useState, useRef, useEffect, useCallback } from 'react'; // Import the useState, useRef, useEffect, and useCallback hooks from React
import debounce from 'lodash/debounce'; // Import the debounce function from Lodash
import EmojiPicker, { Theme } from 'emoji-picker-react'; // Import the EmojiPicker component and Theme
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence from Framer Motion
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import useChatStore from '@/store/chatStore';

// Define the MessageInput component
export default function MessageInput({ onSendMessage, isDarkMode, isAiResponding }) {
  const { messageInput, setMessageInput } = useChatStore(state => ({
    messageInput: state.messageInput,
    setMessageInput: state.setMessageInput
  }));

  const [showPicker, setShowPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const menuRef = useRef(null);
  const [notification, setNotification] = useState(null);

  // Debounced function to send the message with a delay to prevent rapid-fire messages
  const debouncedSendMessage = useCallback(
    debounce((msg) => {
      onSendMessage(msg);
    }, 300),
    [onSendMessage]
  );

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof messageInput === 'string' && messageInput.trim()) {
      debouncedSendMessage(messageInput);
      setMessageInput('');
    }
  };

  // Function to handle key down events on the textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Effect to dynamically adjust the height of the textarea based on its content
  useEffect(() => {
    adjustTextareaHeight();
  }, [messageInput]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 200); // Set max height to 200px
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > 200 ? 'auto' : 'hidden';
  };

  // Function to handle emoji selection from the emoji picker
  const handleEmojiClick = (emojiObject) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = messageInput;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    const newText = before + emojiObject.emoji + after;
    setMessageInput(newText);
    
    // Set cursor position after the inserted emoji
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emojiObject.emoji.length;
      textarea.focus();
    }, 0);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // JSX for the MessageInput component
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
<div className="relative flex items-center space-x-3">
  <motion.button
    type="button"
    onClick={() => setShowMenu(!showMenu)}
    className="flex items-center justify-center w-10 h-10 text-gray-300 hover:text-white transition-colors rounded-full bg-gray-700 bg-opacity-60 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
  </motion.button>
        <AnimatePresence>
          {showMenu && (
            <motion.div
              ref={menuRef}
              className="absolute left-0 bottom-full mb-2 bg-gray-800 rounded-lg shadow-lg z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2 space-y-2">
                <button
                  onClick={() => {
                    setShowPicker(!showPicker);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-700 rounded-md transition-colors"
                >
                  <FontAwesomeIcon icon={faSmile} className="mr-2" />
                  Emoji
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showPicker && (
            <motion.div
              ref={emojiPickerRef}
              className="absolute bottom-full mb-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <EmojiPicker
                onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)}
                theme={Theme.DARK}
                emojiStyle="native"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.textarea
          ref={textareaRef}
          value={messageInput || ''} // Ensure it's always a string
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          rows={1}
          style={{ maxHeight: '200px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isAiResponding ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={{ scale: isAiResponding ? 1 : 1.05 }}
          whileTap={{ scale: isAiResponding ? 1 : 0.95 }}
          disabled={isAiResponding}
        >
          {isAiResponding ? (
            <motion.div
              className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </motion.button>
      </div>
      {notification && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-green-500 text-white rounded-md">
          {notification}
        </div>
      )}
    </motion.form>
  );
}