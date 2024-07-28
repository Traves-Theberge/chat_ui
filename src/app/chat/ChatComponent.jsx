"use client";

// Import necessary hooks and components
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ModalComponent from './ModalComponent';
import ChatSessions from '@/components/ChatSessions';
import ChatMessages from '@/components/ChatMessages';
import MessageInput from '@/components/MessageInput';
import { useSocket } from '@/hooks/useSocket';

const ChatComponent = () => {
  // State to store chat messages
  const [messages, setMessages] = useState([]);
  // State to store the current streaming message
  const [streamingMessage, setStreamingMessage] = useState(null);
  // Router instance from Next.js
  const router = useRouter();
  // Socket instance for real-time communication
  const socket = useSocket('http://localhost:3000');

  useEffect(() => {
    if (socket) {
      // Listen for 'chat message' event and update messages state
      socket.on('chat message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        setIsLoading(false);
      });

      // Listen for 'stream chunk' event and update streamingMessage state
      socket.on('stream chunk', (chunk) => {
        setPartialResponse((prev) => prev + chunk);
      });

      // Listen for 'stream end' event, update messages state and reset streamingMessage
      socket.on('stream end', () => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'AI', content: partialResponse }
        ]);
        setPartialResponse('');
        setIsLoading(false);
      });
    }
  }, [socket, partialResponse]);

  // Function to handle sending a message
  const handleSendMessage = useCallback((message) => {
    if (socket) {
      setIsLoading(true);
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