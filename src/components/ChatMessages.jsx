"use client"; // Indicates that this file is a client-side module
import { useEffect, useRef } from 'react';

export default function ChatMessages({ messages, isLoading, partialResponse }) {
  const messagesEndRef = useRef(null); // Reference to the end of the messages list

  // Function to scroll to the bottom of the messages list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to the bottom whenever messages change
  useEffect(scrollToBottom, [messages, partialResponse]);

  return (
    <div className="flex-grow p-4 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
      {isLoading && <LoadingIndicator />}
      {partialResponse && <MessageBubble message={{ sender: 'AI', content: partialResponse }} />}
      <div ref={messagesEndRef} /> {/* Reference element to scroll to */}
    </div>
  );
}

function MessageBubble({ message }) {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-4 ${
          message.sender === 'user'
            ? 'bg-gradient-to-r from-blue-500 to-blue-500 text-white'
            : 'bg-gradient-to-r from-gray-600 to-gray-600 text-white'
        } shadow-lg`}
      >
        <p className="text-sm md:text-base">{message.content}</p> {/* Message content */}
        <p className="text-xs mt-2 opacity-70">
          {message.sender === 'user' ? 'You' : 'AI'} {/* Sender label */}
        </p>
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-600 rounded-full p-3">
        <div className="dot-flashing"></div>
      </div>
    </div>
  );
}