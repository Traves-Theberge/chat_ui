// SidebarContainer.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useChatStore from '@/store/chatStore';
import SidebarHeader from './SidebarHeader';
import SidebarChatList from './SidebarChatList';
import SidebarFooter from './SidebarFooter';
import SidebarNewChatModal from './SidebarNewChatModal';
import { handleDeleteChat, handleLogout } from '@/utils/sidebarHandlers';

export default function Sidebar({ setCurrentChat, currentChat, onChatDelete, isMessageLoading }) {
  const { chats, fetchChats } = useChatStore((state) => ({ 
    chats: state.chats,
    fetchChats: state.fetchChats
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  useEffect(() => {
    const loadChats = async () => {
      setIsLoading(true);
      try {
        await fetchChats();
      } catch (error) {
        console.error('Error fetching chats:', error);
        toast.error(`Failed to load chat sessions: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadChats();
  }, [fetchChats]);

  const handleOpenNewChatModal = () => setIsModalOpen(true);
  const handleCloseNewChatModal = () => setIsModalOpen(false);

  const handleCreateChat = async () => {
    if (!newChatName.trim()) {
      toast.error('Chat name cannot be empty');
      return;
    }
    try {
      const createChat = useChatStore.getState().createChat;
      const newChat = await createChat(newChatName);
      setCurrentChat(newChat.id);
      await fetchChats(); // Refetch the chats to ensure the new chat is in the list
      handleCloseNewChatModal();
      setNewChatName('');
      toast.success('New chat created successfully');
    } catch (error) {
      console.error('Error creating chat:', error);
      if (error.message === 'A chat with this name already exists') {
        toast.error('A chat with this name already exists. Please choose a different name.');
      } else if (error.message === 'Network Error') {
        toast.error('Unable to create chat due to network issues. Please try again later.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className={`bg-navy text-light-gray flex flex-col h-full transition-all duration-300 ease-in-out border-r border-light-gray border-opacity-20 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-grow overflow-y-auto">
        <SidebarChatList 
          isLoading={isLoading}
          isCollapsed={isCollapsed}
          chats={chats}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          handleDeleteChat={(chatId) => handleDeleteChat(chatId, fetchChats, setCurrentChat, currentChat, onChatDelete)}
          isMessageLoading={isMessageLoading}
        />
      </div>
      <SidebarFooter 
        isCollapsed={isCollapsed}
        handleOpenNewChatModal={handleOpenNewChatModal}
        handleLogout={handleLogout}
      />
      <SidebarNewChatModal 
        isOpen={isModalOpen}
        onClose={handleCloseNewChatModal}
        newChatName={newChatName}
        setNewChatName={setNewChatName}
        handleCreateChat={handleCreateChat}
      />
    </div>
  );
}