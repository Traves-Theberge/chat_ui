// SidebarContainer.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useChatStore from '@/store/chatStore';
import SidebarHeader from './SidebarHeader';
import SidebarChatList from './SidebarChatList';
import SidebarFooter from './SidebarFooter';
import SidebarNewChatModal from './SidebarNewChatModal';
import { handleDeleteChat, handleLogout } from '@/utils/sidebarHandlers';
import PromptTemplateButton from './promptTemplates/PromptTemplateButton';
import PromptTemplateModal from './promptTemplates/PromptTemplateModal';
import { fillTemplatePlaceholders } from '@/utils/apiUtils';

export default function Sidebar({ setCurrentChat, currentChat, onChatDelete }) {
  const { chats, fetchChats } = useChatStore((state) => ({ 
    chats: state.chats,
    fetchChats: state.fetchChats
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [isPromptTemplateModalOpen, setIsPromptTemplateModalOpen] = useState(false);

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
      } else {
        toast.error(`Failed to create chat: ${error.message}`);
      }
    }
  };

  const handleOpenPromptTemplateModal = () => setIsPromptTemplateModalOpen(true);
  const handleClosePromptTemplateModal = () => setIsPromptTemplateModalOpen(false);

  const handleApplyTemplate = (filledTemplate) => {
    const { setMessageInput } = useChatStore.getState();
    setMessageInput(filledTemplate);
  };

  return (
    <div className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <SidebarChatList 
        isLoading={isLoading}
        isCollapsed={isCollapsed}
        chats={chats}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        handleDeleteChat={(chatId) => handleDeleteChat(chatId, fetchChats, setCurrentChat, currentChat, onChatDelete)}
      />
      <div className="mt-auto p-4">
        <PromptTemplateButton onClick={handleOpenPromptTemplateModal} isCollapsed={isCollapsed} />
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
      <PromptTemplateModal
        isOpen={isPromptTemplateModalOpen}
        onClose={handleClosePromptTemplateModal}
        onApplyTemplate={handleApplyTemplate}
      />
    </div>
  );
}
