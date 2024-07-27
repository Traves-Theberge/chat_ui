"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for client-side routing
import ModalComponent from './ModalComponent';
import ChatSessions from '@/components/ChatSessions';
import MessageHandler from '@/components/MessageHandler';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch initial messages or set up WebSocket connection
  }, []);

  const handleSendMessage = (message) => {
    // Logic to send a message
  };

  return (
    <div className="chat-container">
      <ChatSessions />
      <MessageHandler messages={messages} onSendMessage={handleSendMessage} />
      <ModalComponent />
    </div>
  );
};

export default ChatComponent;
