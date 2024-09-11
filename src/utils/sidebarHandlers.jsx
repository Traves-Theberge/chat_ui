// sidebarHandlers.jsx
import supabase from '@/utils/supabaseClient';
import { toast } from 'react-toastify';
import useChatStore from '@/store/chatStore';

export const handleCreateChat = async (newChatName, chats, setCurrentChat, setIsModalOpen, setNewChatName) => {
  if (!newChatName || !newChatName.trim()) return;

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session || !session.user) {
      console.error('Session error:', sessionError || 'No valid session found');
      toast.error('No active user session. Please log in again.');
      return;
    }

    // Check if a chat with the same name already exists
    const existingChat = chats.find(chat => chat.session_name === newChatName.trim());
    if (existingChat) {
      toast.warning('A chat with this name already exists.');
      return;
    }

    setIsModalOpen(false); // Close the modal immediately to prevent double submission

    const { data: chatData, error: chatError } = await supabase.from('chat_sessions').insert({
      user_id: session.user.id,
      session_name: newChatName.trim()
    }).select().single();

    if (chatError) {
      console.error('Chat creation error:', chatError);
      toast.error('Error adding chat session: ' + chatError.message);
    } else if (chatData) {
      useChatStore.getState().addChat(chatData);
      setCurrentChat(chatData.id);
      toast.success('New chat session added successfully');
      setNewChatName('');
    } else {
      console.error('No chat data returned');
      toast.error('Error creating chat: No data returned');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    toast.error('An unexpected error occurred. Please try again.');
  }
};

export const handleDeleteChat = async (chatId, fetchChats, setCurrentChat, currentChat, onChatDelete) => {
  try {
    const { error } = await supabase.from('chat_sessions').delete().eq('id', chatId);
    if (error) {
      toast.error('Error deleting chat session: ' + error.message);
    } else {
      await fetchChats(); // Fetch updated chats after deleting one
      if (currentChat === chatId) {
        setCurrentChat(null); // Reset current chat if it was deleted
        onChatDelete(chatId); // Clear the messages for the deleted chat
      }
      toast.success('Chat session deleted successfully');
    }
  } catch (error) {
    console.error('Unexpected error during chat deletion:', error);
    toast.error('An unexpected error occurred while deleting the chat. Please try again.');
  }
};

export const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error logging out: ' + error.message);
    } else {
      window.location.href = '/'; // Redirect to home page
      toast.success('Logged out successfully');
    }
  } catch (error) {
    console.error('Unexpected error during logout:', error);
    toast.error('An unexpected error occurred while logging out. Please try again.');
  }
};