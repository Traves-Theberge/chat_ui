"use client";
import { useEffect, useRef } from 'react';

export default function ChatMessages({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-grow p-4 overflow-y-auto bg-gray-800">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
        >
          <div
            className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
              message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
            }`}
          >
            <p>{message.content}</p>
            <p className="text-xs mt-1 opacity-70">
              {message.sender === 'user' ? 'You' : 'AI'}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}