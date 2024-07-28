"use client";

import { useState, useEffect } from 'react';
import supabase from '@/utils/supabaseClient';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Sidebar({ setCurrentChat, currentChat }) {
  const [chats, setChats] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const handleDeleteChat = async (chatId) => {
    const { error } = await supabase.from('chat_sessions').delete().eq('id', chatId);
    if (error) {
      toast.error('Error deleting chat session: ' + error.message);
    } else {
      setChats(chats => chats.filter(chat => chat.id !== chatId));
      if (currentChat === chatId) {
        setCurrentChat(null);
      }
      toast.success('Chat session deleted successfully');
    }
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
    <div className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 bg-gray-800 flex justify-between items-center h-16">
        {!isCollapsed && <h1 className="text-xl font-semibold">Chat History</h1>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white">
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      {!isCollapsed && (
        <>
          <div className="flex-grow overflow-y-auto">
            <div className="p-4 space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-lg cursor-pointer transition duration-200 flex justify-between items-center ${
                    currentChat === chat.id
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <span onClick={() => setCurrentChat(chat.id)}>{chat.session_name}</span>
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className="text-red-400 hover:text-red-300 transition duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 space-y-2">
            <button
              onClick={handleAddChat}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              New Chat
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}