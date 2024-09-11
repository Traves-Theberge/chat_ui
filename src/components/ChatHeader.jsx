"use client"; // Indicates that this file is a client-side module

import React from 'react'; // Import the useState hook

// Define the ChatHeader component
export default function ChatHeader({ currentChat }) {
  return (
    <div className="bg-navy text-light-gray p-4 shadow-md flex items-center justify-between flex-wrap border-b border-light-gray border-opacity-20">
      <h2 className="text-xl font-semibold">LonestarAI</h2>
      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        {/* Add any additional header items here */}
      </div>
    </div>
  );
}