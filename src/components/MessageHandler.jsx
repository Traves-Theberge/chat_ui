"use client"; // Indicates that this file is a client-side module

import { useState } from 'react'; // Import the useState hook from React

// Define the MessageHandler component
const MessageHandler = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState(''); // State to manage the new message input

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    onSendMessage(newMessage); // Call the onSendMessage function with the new message
    setNewMessage(''); // Clear the input field
  };

  return (
    <div className="message-handler"> {/* Container div for the message handler */}
      <div className="messages"> {/* Container div for the messages */}
        {messages.map((message, index) => (
          <div key={index} className="message"> {/* Individual message */}
            {message} {/* Display the message content */}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}> {/* Form element with onSubmit handler */}
        <input
          type="text" // Input type is text
          value={newMessage} // Bind the input value to the newMessage state
          onChange={(e) => setNewMessage(e.target.value)} // Update the newMessage state on input change
          placeholder="Type a message" // Placeholder text for the input
        />
        <button type="submit">Send</button> {/* Submit button */}
      </form>
    </div>
  );
};

export default MessageHandler; // Export the MessageHandler component
