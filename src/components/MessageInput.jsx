"use client"; // Indicates that this file is a client-side module

import { useState, useRef, useEffect, useCallback } from 'react'; // Import the useState, useRef, useEffect, and useCallback hooks from React
import debounce from 'lodash/debounce'; // Import the debounce function from Lodash
import EmojiPicker from 'emoji-picker-react'; // Import the EmojiPicker component

// Define the MessageInput component
export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState(''); // State to manage the input message
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

  // Debounced function to send the message
  const debouncedSendMessage = useCallback(
    debounce((msg) => {
      onSendMessage(msg);
    }, 300), // Debounce for 300ms
    [onSendMessage] // Dependency on the onSendMessage function
  );

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (message.trim()) { // Check if the message is not empty
      debouncedSendMessage(message); // Call the debounced function with the message
      setMessage(''); // Clear the input field
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
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border-t border-gray-700"> {/* Form element with styles */}
      <div className="relative flex items-end space-x-2"> {/* Container div with flexbox styles */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <textarea
          ref={textareaRef}
          type="text" // Input type is text
          value={message} // Bind the input value to the message state
          onChange={(e) => setMessage(e.target.value)} // Update the message state on input change
          className="flex-grow p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none" // Input element styles
          placeholder="Type your message..." // Placeholder text for the input
          rows={1}
        />
        <button
          type="submit" // Button type is submit
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" // Button element styles
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* SVG icon for the button */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /> {/* Path for the SVG icon */}
          </svg>
        </button>
      </div>
    </form>
  );
}