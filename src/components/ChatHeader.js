"use client";

import ModelSelector from '@/components/ModelSelector';

export default function ChatHeader({ currentChat, model, setModel }) {
  return (
    <div className="p-4 bg-gray-800 text-white shadow flex justify-between items-center">
      <h1 className="text-xl">{currentChat ? `Chat ${currentChat}` : 'Select a chat'}</h1>
      <ModelSelector model={model} setModel={setModel} />
    </div>
  );
}