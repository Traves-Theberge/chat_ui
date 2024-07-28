"use client"; // Indicates that this file is a client-side module
import { useEffect, useRef, useState } from 'react';

export default function ChatMessages({ messages, isLoading, partialResponse }) {
  const messagesEndRef = useRef(null); // Reference to the end of the messages list

  // Function to scroll to the bottom of the messages list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to the bottom whenever messages change
  useEffect(scrollToBottom, [messages, partialResponse]);

  const groupedMessages = messages.reduce((acc, message, index) => {
    if (index === 0 || message.sender !== messages[index - 1].sender) {
      acc.push([message]);
    } else {
      acc[acc.length - 1].push(message);
    }
    return acc;
  }, []);

  return (
    <div className="flex-grow p-4 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800">
      {groupedMessages.map((group, groupIndex) => (
        <MessageGroup key={groupIndex} messages={group} />
      ))}
      {isLoading && <LoadingIndicator />}
      {partialResponse && <MessageBubble message={{ sender: 'AI', content: partialResponse }} />}
      <div ref={messagesEndRef} /> {/* Reference element to scroll to */}
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

  return (
    <div
      className={`relative max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-4 ${
        message.sender === 'user'
          ? 'bg-gradient-to-r from-blue-500 to-blue-500 text-white'
          : 'bg-gradient-to-r from-gray-600 to-gray-600 text-white'
      } shadow-lg ${isGrouped ? 'mt-1' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <p className="text-sm md:text-base">{message.content}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs opacity-70">
          {message.sender === 'user' ? 'You' : 'AI'}
        </p>
        <p className="text-xs opacity-70">
          {new Date(message.created_at).toLocaleTimeString()}
        </p>
      </div>
      {showActions && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button onClick={() => navigator.clipboard.writeText(message.content)} className="text-xs bg-gray-700 p-1 rounded">Copy</button>
        </div>
      )}
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex items-center space-x-2 text-gray-400 text-sm">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
    </div>
  );
}