"use client";

import { useState } from 'react';

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 bg-gray-800">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 bg-gray-700 text-white rounded"
          placeholder="Type a message"
        />
        <button type="submit" className="ml-2 p-2 bg-pink-500 text-white rounded">Send</button>
      </form>
    </div>
  );
}
