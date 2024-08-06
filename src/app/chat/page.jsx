"use client";

// Import necessary hooks and components
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar/SidebarContainer';
import ChatHeader from '@/components/ChatHeader.jsx';
import ChatMessages from '@/components/ChatMessages.jsx';
import MessageInput from '@/components/MessageInput.jsx';
import initializeModels from '@/utils/modelClients.jsx';
import useChatStore from '@/store/chatStore';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

export default function ChatPage() {
  // State to manage the selected AI model
  const { currentChat, setCurrentChat, messages, fetchMessages, fetchChats, sendMessage, model, setModel } = useChatStore(state => ({
    currentChat: state.currentChat,
    setCurrentChat: state.setCurrentChat,
    messages: state.messages,
    fetchMessages: state.fetchMessages,
    fetchChats: state.fetchChats,
    sendMessage: state.sendMessage,
    model: state.model,
    setModel: state.setModel
  }));
  // State to manage the loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to manage AI response loading
  const [isAiResponding, setIsAiResponding] = useState(false);
  // State to manage message loading
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  // Router instance from Next.js
  const router = useRouter();
  const { session, loading } = useAuth();
  const { subscribeToMessages } = useChatStore(state => ({
    subscribeToMessages: state.subscribeToMessages,
    currentChat: state.currentChat
  }));

  const debouncedFetchMessages = useCallback(
    debounce((chatId) => {
      if (chatId) {
        fetchMessages(chatId).catch(error => {
          console.error('Error loading messages:', error);
          toast.error('Failed to load messages. Please try again.');
        });
      }
    }, 300),
    [fetchMessages, toast]
  );

  // Effect to fetch messages when the current chat changes
  useEffect(() => {
    debouncedFetchMessages(currentChat);
  }, [currentChat, debouncedFetchMessages]);

  // Function to handle sending a message
  const handleSendMessage = useCallback(async (message) => {
    if (!currentChat) return;

    setIsMessageLoading(true);

    const userMessage = {
      content: message,
      sender: 'user',
      session_id: currentChat,
      created_at: new Date().toISOString()
    };

    // Add the user message to the store
    sendMessage(userMessage);

    // Generate AI response
    const models = await initializeModels();
    let aiModel;
    if (model.startsWith('gpt')) {
      aiModel = models.openai;
    } else {
      aiModel = models.mistral;
    }

    setIsAiResponding(true);
    try {
      // Format the messages for the AI model
      const formattedMessages = [...messages, userMessage].map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      // Generate the AI response
      const aiResponse = await aiModel.generateMessage([
        ...formattedMessages,
        { role: 'user', content: message }
      ], model);

      if (typeof aiResponse !== 'string') {
        throw new Error('Invalid AI response format');
      }

      // Create a new AI message object
      const aiMessage = { 
        content: aiResponse, 
        sender: 'assistant', 
        session_id: currentChat,
        created_at: new Date().toISOString()
      };

      // Add the AI message to the store
      sendMessage(aiMessage);

    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Error generating response: ' + error.message);
    } finally {
      setIsAiResponding(false);
      setIsMessageLoading(false);
    }
  }, [currentChat, model, messages, sendMessage]);

  // Effect to check authentication status on component mount
  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.push('/login');
      } else {
        setIsLoading(false);
        // We don't need to fetch chats here, as they will be added individually
      }
    }
  }, [session, loading, router]);

  const handleChatDelete = (deletedChatId) => {
    if (currentChat === deletedChatId) {
      setCurrentChat(null);
      useChatStore.getState().clearMessages();
    }
  };

  useEffect(() => {
    let unsubscribe;
    if (currentChat) {
      unsubscribe = subscribeToMessages(currentChat);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentChat, subscribeToMessages]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar component to select chat sessions */}
      <Sidebar 
        setCurrentChat={setCurrentChat} 
        currentChat={currentChat} 
        onChatDelete={handleChatDelete}
        isMessageLoading={isMessageLoading}
      />
      <div className="flex flex-col flex-grow bg-gray-800">
        {/* Chat header component */}
        <ChatHeader currentChat={currentChat} model={model} setModel={setModel} />
        {/* Chat messages component */}
        <ChatMessages messages={messages} isLoading={isLoading} isAiResponding={isAiResponding} isMessageLoading={isMessageLoading} />
        {/* Message input component */}
        <MessageInput onSendMessage={handleSendMessage} model={model} />
      </div>
    </div>
  );
}