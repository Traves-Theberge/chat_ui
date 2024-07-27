"use client";

import { useState, useEffect } from 'react';
import supabase from '@/utils/supabaseClient';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Sidebar({ setCurrentChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const { data, error } = await supabase.from('chat_sessions').select('*');
    if (error) {
      toast.error('Error fetching chat sessions: ' + error.message);
    } else {
      setChats(data || []);
    }
  };

  const handleAddChat = async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      toast.error('Error getting user session. Please log in again.');
      // Redirect to login page or show login modal
      return;
    }

    const chatName = prompt('Enter a name for the new chat:');
    if (!chatName) return; // User cancelled the prompt

    const { data: chatData, error: chatError } = await supabase.from('chat_sessions').insert({
      user_id: data.session.user.id,
      session_name: chatName
    }).select();

    if (chatError) {
      toast.error('Error adding chat session: ' + chatError.message);
    } else {
      setChats([...chats, chatData[0]]);
      setCurrentChat(chatData[0].id);
      toast.success('New chat session added successfully');
    }
  };

  const debouncedDeleteChat = debounce(async (chatId) => {
    const { error } = await supabase.from('chat_sessions').delete().eq('id', chatId);
    if (error) {
      toast.error('Error deleting chat session: ' + error.message);
    } else {
      setChats(chats => chats.filter(chat => chat.id !== chatId));
      setCurrentChat(null);
      toast.success('Chat session deleted successfully');
    }
  }, 300);

  const handleDeleteChat = (chatId) => {
    debouncedDeleteChat(chatId);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error logging out: ' + error.message);
    } else {
      window.location.href = '/';
      toast.success('Logged out successfully');
    }
  };

  return (
    <nav className="w-64 bg-gray-800 p-4 text-white" aria-label="Chat sessions">
      <h2 className="text-xl mb-4">Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="mb-2 flex justify-between items-center">
            <button
              className="text-left cursor-pointer flex-grow"
              onClick={() => setCurrentChat(chat.id)}
              aria-label={`Select chat: ${chat.session_name}`}
            >
              {chat.session_name}
            </button>
            <button
              onClick={() => handleDeleteChat(chat.id)}
              aria-label={`Delete chat: ${chat.session_name}`}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddChat}
        className="mt-4 w-full p-2 bg-green-500 text-white rounded"
        aria-label="Add new chat"
      >
        Add Chat
      </button>
      <button
        onClick={handleLogout}
        className="mt-4 w-full p-2 bg-red-500 text-white rounded"
        aria-label="Logout"
      >
        Logout
      </button>
    </nav>
  );
}