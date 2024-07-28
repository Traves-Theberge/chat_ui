"use client";

// Import necessary hooks and components
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader.jsx';
import ChatMessages from '@/components/ChatMessages.jsx';
import MessageInput from '@/components/MessageInput.jsx';
import supabase from '@/utils/supabaseClient.jsx';
import initializeModels from '@/utils/modelClients.jsx';

export default function ChatPage() {
  // State to manage the current chat session
  const [currentChat, setCurrentChat] = useState(null);
  // State to manage the list of messages
  const [messages, setMessages] = useState([]);
  // State to manage the selected AI model
  const [model, setModel] = useState('gpt-3.5-turbo');
  // State to manage the loading status
  const [isLoading, setIsLoading] = useState(true);
  // Router instance from Next.js
  const router = useRouter();

  // Function to handle sending a message
  const handleSendMessage = useCallback(async (message) => {
    if (!currentChat) return;

    // Create a new message object
    const newMessage = { 
      content: message, 
      sender: 'user', 
      session_id: currentChat,
      created_at: new Date().toISOString()
    };
    // Insert the new message into the database
    const { data, error } = await supabase.from('conversations').insert(newMessage).select();
    
    if (error) {
      console.error('Error inserting message:', error);
      return;
    }

    // Update the messages state with the new message
    setMessages(prevMessages => [...prevMessages, data[0]]);

    // Generate AI response
    const models = await initializeModels();
    let aiModel;
    if (model.startsWith('gpt')) {
      aiModel = models.openai;
    } else {
      aiModel = models.mistral;
    }

    try {
      // Format the messages for the AI model
      const formattedMessages = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      // Generate the AI response
      const aiResponse = await aiModel.generateMessage([
        ...formattedMessages,
        { role: 'user', content: message }
      ], model);

      // Create a new AI message object
      const aiMessage = { 
        content: aiResponse, 
        sender: 'assistant', 
        session_id: currentChat,
        created_at: new Date().toISOString()
      };
      // Insert the AI message into the database
      const { data: aiData, error: aiError } = await supabase.from('conversations').insert(aiMessage).select();
      
      if (aiError) {
        console.error('Error inserting AI message:', aiError);
        return;
      }

      // Update the messages state with the AI message
      setMessages(prevMessages => [...prevMessages, aiData[0]]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    }
  }, [currentChat, model, messages]);

  // Effect to fetch messages when the current chat changes
  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat);
    }
  }, [currentChat]);

  // Effect to check authentication status on component mount
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

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (event === 'SIGNED_IN' && session) {
        setIsLoading(false);
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Show loading screen if the app is still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Function to fetch messages for a given chat session
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

  const handleChatDelete = (deletedChatId) => {
    if (currentChat === deletedChatId) {
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar component to select chat sessions */}
      <Sidebar 
        setCurrentChat={setCurrentChat} 
        currentChat={currentChat} 
        onChatDelete={handleChatDelete}
      />
      <div className="flex flex-col flex-grow">
        {/* Chat header component */}
        <ChatHeader currentChat={currentChat} model={model} setModel={setModel} />
        {/* Chat messages component */}
        <ChatMessages messages={messages} isLoading={isLoading} />
        {/* Message input component */}
        <MessageInput onSendMessage={handleSendMessage} model={model} />
      </div>
    </div>
  );
}