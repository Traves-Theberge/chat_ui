"use client"; // Indicates that this file is a client-side module

import React from 'react'; // Import the useState hook

// Define the ChatHeader component
export default function ChatHeader({ currentChat }) {
  return (
    <div className="bg-gray-900 text-white p-4 shadow-md flex items-center justify-between flex-wrap">
      <h2 className="text-xl font-semibold">Chat Session</h2>
      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        <span>GPT-4 Mini</span>
      </div>
    </div>
  );
}