"use client"; // Indicates that this file is a client-side module

import React, { useState } from 'react'; // Import the useState hook
import ModelSelector from '@/components/ModelSelector'; // Import the ModelSelector component
import DownloadModal from '@/components/DownloadModal'; // Import the DownloadModal component
import useChatStore from '@/store/chatStore'; // Import the chatStore
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Define the ChatHeader component
export default function ChatHeader({ currentChat, model, setModel }) {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const prepareDownload = useChatStore(state => state.prepareDownload);

  const handleDownload = (format, customFilename) => {
    if (!currentChat) return;
    const { url, filename } = prepareDownload(format);
    const a = document.createElement('a');
    a.href = url;
    a.download = customFilename || filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900 text-white p-4 shadow-md flex items-center justify-between flex-wrap"> {/* Container div with styles */}
      <h2 className="text-xl font-semibold">Chat Session</h2> {/* Header text */}
      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        <button 
          onClick={() => setIsDownloadModalOpen(true)} 
          disabled={!currentChat}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
            !currentChat ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Download Chat
        </button>
        <ModelSelector model={model} setModel={setModel} /> {/* ModelSelector component */}
        <button
          onClick={() => useChatStore.getState().speakConversation()}
          className="ml-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200"
          title="Speak conversation"
        >
          <FontAwesomeIcon icon={faVolumeUp} />
        </button>
      </div>
      <DownloadModal 
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownload}
      />
    </div>
  );
}