"use client";

import { useState, useEffect } from 'react';
import supabase from '@/utils/supabaseClient';

export default function Sidebar({ setCurrentChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const { data, error } = await supabase.from('chats').select('*');
    if (error) {
      console.error('Error fetching chats:', error);
    } else {
      setChats(data || []); // Ensure data is an array
    }
  };

  const handleAddChat = async () => {
    const { data, error } = await supabase.from('chats').insert({ name: 'New Chat' }).select();
    if (error) {
      console.error('Error adding chat:', error);
    } else {
      setChats([...chats, data[0]]);
    }
  };

  const handleDeleteChat = async (chatId) => {
    const { error } = await supabase.from('chats').delete().eq('id', chatId);
    if (error) {
      console.error('Error deleting chat:', error);
    } else {
      setChats(chats.filter(chat => chat.id !== chatId));
      setCurrentChat(null);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="w-64 bg-gray-800 p-4 text-white">
      <h2 className="text-xl mb-4">Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="mb-2 cursor-pointer flex justify-between items-center" onClick={() => setCurrentChat(chat.id)}>
            {chat.name}
            <button onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddChat} className="mt-4 w-full p-2 bg-green-500 text-white rounded">Add Chat</button>
      <button onClick={handleLogout} className="mt-4 w-full p-2 bg-red-500 text-white rounded">Logout</button>
    </div>
  );
}
