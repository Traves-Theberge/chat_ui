"use client";

import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatMessages from '@/components/ChatMessages';
import MessageInput from '@/components/MessageInput';
import { useState, useEffect } from 'react';
import supabase from '@/utils/supabaseClient';

export default function ChatPage() {
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState('default'); // Add model state

  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat);
    }
  }, [currentChat]);

  const fetchMessages = async (chatId) => {
    const { data } = await supabase.from('messages').select('*').eq('chat_id', chatId);
    setMessages(data);
  };

  const handleSendMessage = async (message) => {
    const newMessage = { text: message, sender: 'user', chat_id: currentChat };
    const { data } = await supabase.from('messages').insert(newMessage);
    setMessages([...messages, data[0]]);
  };

  return (
    <div className="flex h-screen">
      <Sidebar setCurrentChat={setCurrentChat} />
      <div className="flex flex-col flex-grow">
        <ChatHeader currentChat={currentChat} model={model} setModel={setModel} />
        <ChatMessages messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
