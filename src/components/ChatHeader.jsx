"use client"; // Indicates that this file is a client-side module

import ModelSelector from '@/components/ModelSelector'; // Import the ModelSelector component

// Define the ChatHeader component
export default function ChatHeader({ currentChat, model, setModel }) {
  return (
    <div className="bg-gray-900 text-white p-4 shadow-md h-16 flex items-center"> {/* Container div with styles */}
      <div className="flex items-center justify-between w-full"> {/* Inner div with flexbox styles */}
        <h2 className="text-xl font-semibold">Chat Session</h2> {/* Header text */}
        <ModelSelector model={model} setModel={setModel} /> {/* ModelSelector component */}
      </div>
    </div>
  );
}