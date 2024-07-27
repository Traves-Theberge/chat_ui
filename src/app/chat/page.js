"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatMessages from '@/components/ChatMessages';
import MessageInput from '@/components/MessageInput';
import supabase from '@/utils/supabaseClient';
import initializeModels from '@/utils/modelClients';

export default function ChatPage() {
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleSendMessage = useCallback(async (message) => {
    if (!currentChat) return;

    const newMessage = { 
      content: message, 
      sender: 'user', 
      session_id: currentChat,
      created_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('conversations').insert(newMessage).select();
    
    if (error) {
      console.error('Error inserting message:', error);
      return;
    }

    setMessages(prevMessages => [...prevMessages, data[0]]);

    // Generate AI response
    const models = await initializeModels();
    let aiModel;
    if (model.startsWith('gpt')) {
      aiModel = models.openai;
    } else if (model.startsWith('mistral')) {
      aiModel = models.mistral;
    } else {
      console.error('Unknown model selected:', model);
      return;
    }

    try {
      const formattedMessages = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const aiResponse = await aiModel.generateMessage([
        ...formattedMessages,
        { role: 'user', content: message }
      ], model);

      const aiMessage = { 
        content: aiResponse, 
        sender: 'assistant', 
        session_id: currentChat,
        created_at: new Date().toISOString()
      };
      const { data: aiData, error: aiError } = await supabase.from('conversations').insert(aiMessage).select();
      
      if (aiError) {
        console.error('Error inserting AI message:', aiError);
        return;
      }

      setMessages(prevMessages => [...prevMessages, aiData[0]]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    }
  }, [currentChat, model, messages]);

  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat);
    }
  }, [currentChat]);

  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat);
    }
  }, [currentChat]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (event === 'SIGNED_IN' && session) {
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const fetchMessages = async (chatId) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('session_id', chatId)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar setCurrentChat={setCurrentChat} currentChat={currentChat} />
      <div className="flex flex-col flex-grow">
        <ChatHeader currentChat={currentChat} model={model} setModel={setModel} />
        <ChatMessages messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} model={model} />
      </div>
    </div>
  );
}