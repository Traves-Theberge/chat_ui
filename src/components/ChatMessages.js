"use client";
import { useEffect, useRef } from 'react';

export default function ChatMessages({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-grow p-4 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
        >
          <div
            className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-4 ${
              message.sender === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-500 text-white' 
                : 'bg-gradient-to-r from-gray-600 to-gray-600 text-white'
            } shadow-lg`}
          >
            <p className="text-sm md:text-base">{message.content}</p>
            <p className="text-xs mt-2 opacity-70">
              {message.sender === 'user' ? 'You' : 'AI'}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}