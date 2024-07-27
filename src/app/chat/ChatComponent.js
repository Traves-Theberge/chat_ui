"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for client-side routing
import ModalComponent from './ModalComponent';
import ChatSessions from '@/components/ChatSessions';
import MessageHandler from '@/components/MessageHandler';
import { useSocket } from '@/hooks/useSocket';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const socket = useSocket('http://localhost:3000'); // Adjust URL as needed

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  const handleSendMessage = (message) => {
    if (socket) {
      socket.emit('chat message', message);
    }
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