"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ModalComponent from './ModalComponent';
import ChatSessions from '@/components/ChatSessions';
import ChatMessages from '@/components/ChatMessages';
import MessageInput from '@/components/MessageInput';
import { useSocket } from '@/hooks/useSocket';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const router = useRouter();
  const socket = useSocket('http://localhost:3000');

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('stream chunk', (chunk) => {
        setStreamingMessage((prev) => prev ? { ...prev, content: prev.content + chunk } : { sender: 'AI', content: chunk });
      });

      socket.on('stream end', () => {
        setMessages((prevMessages) => [...prevMessages, streamingMessage]);
        setStreamingMessage(null);
      });
    }
  }, [socket]);

  const handleSendMessage = useCallback((message) => {
    if (socket) {
      socket.emit('chat message', { content: message, sender: 'user' });
    }
  }, [socket]);

  return (
    <div className="chat-container flex flex-col h-screen">
      <ChatSessions />
      <div className="flex-grow overflow-hidden">
        <ChatMessages messages={messages} streamingMessage={streamingMessage} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
      <ModalComponent />
    </div>
  );
};

export default ChatComponent;