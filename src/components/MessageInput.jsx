"use client"; // Indicates that this file is a client-side module

import { useState, useCallback } from 'react'; // Import the useState and useCallback hooks from React
import debounce from 'lodash/debounce'; // Import the debounce function from Lodash

// Define the MessageInput component
export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState(''); // State to manage the input message

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

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border-t border-gray-700"> {/* Form element with styles */}
      <div className="flex items-center space-x-2"> {/* Container div with flexbox styles */}
        <input
          type="text" // Input type is text
          value={message} // Bind the input value to the message state
          onChange={(e) => setMessage(e.target.value)} // Update the message state on input change
          className="flex-grow p-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" // Input element styles
          placeholder="Type your message..." // Placeholder text for the input
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