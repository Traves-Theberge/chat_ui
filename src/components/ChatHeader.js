"use client";

import ModelSelector from '@/components/ModelSelector';

export default function ChatHeader({ currentChat, model, setModel }) {
  return (
    <div className="bg-gray-800 p-4 shadow-md h-16 flex items-center">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold text-white">Chat Session</h2>
        <ModelSelector model={model} setModel={setModel} />
      </div>
    </div>
  );
}