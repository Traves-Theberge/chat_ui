"use client"; // Indicates that this file is a client-side module

import { useState, useEffect } from 'react'; // Import useState and useEffect hooks from React
import supabase from '@/utils/supabaseClient'; // Import supabase client
import { debounce } from 'lodash'; // Import debounce function from lodash
import { toast } from 'react-toastify'; // Import toast function from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS

// Define the Sidebar component
export default function Sidebar({ setCurrentChat, currentChat }) {
  const [chats, setChats] = useState([]); // State to manage chat sessions
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar collapse

  // Fetch chat sessions on component mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Function to fetch chat sessions from the database
  const fetchChats = async () => {
    const { data, error } = await supabase.from('chat_sessions').select('*'); // Fetch chat sessions
    if (error) {
      toast.error('Error fetching chat sessions: ' + error.message); // Show error toast if fetching fails
    } else {
      setChats(data || []); // Set chat sessions state
    }
  };

  // Function to handle adding a new chat session
  const handleAddChat = async () => {
    const { data, error } = await supabase.auth.getSession(); // Get user session
    
    if (error || !data.session) {
      toast.error('Error getting user session. Please log in again.'); // Show error toast if session retrieval fails
      // Redirect to login page or show login modal
      return;
    }

    const chatName = prompt('Enter a name for the new chat:'); // Prompt user for chat name
    if (!chatName) return; // User cancelled the prompt

    const { data: chatData, error: chatError } = await supabase.from('chat_sessions').insert({
      user_id: data.session.user.id, // Insert new chat session with user ID and chat name
      session_name: chatName
    }).select();

    if (chatError) {
      toast.error('Error adding chat session: ' + chatError.message); // Show error toast if insertion fails
    } else {
      setChats([...chats, chatData[0]]); // Update chat sessions state
      setCurrentChat(chatData[0].id); // Set current chat to the new chat session
      toast.success('New chat session added successfully'); // Show success toast
    }
  };

  // Function to handle deleting a chat session
  const handleDeleteChat = async (chatId) => {
    const { error } = await supabase.from('chat_sessions').delete().eq('id', chatId); // Delete chat session by ID
    if (error) {
      toast.error('Error deleting chat session: ' + error.message); // Show error toast if deletion fails
    } else {
      setChats(chats => chats.filter(chat => chat.id !== chatId)); // Update chat sessions state
      if (currentChat === chatId) {
        setCurrentChat(null); // Reset current chat if it was deleted
      }
      toast.success('Chat session deleted successfully'); // Show success toast
    }
  };

  // Function to handle user logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); // Sign out user
    if (error) {
      toast.error('Error logging out: ' + error.message); // Show error toast if logout fails
    } else {
      window.location.href = '/'; // Redirect to home page
      toast.success('Logged out successfully'); // Show success toast
    }
  };

  return (
    <div className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 bg-gray-800 flex justify-between items-center h-16">
        {!isCollapsed && <h1 className="text-xl font-semibold">Chat History</h1>} {/* Sidebar title */}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white">
          {isCollapsed ? '→' : '←'} {/* Collapse/Expand button */}
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
                  <span onClick={() => setCurrentChat(chat.id)}>{chat.session_name}</span> {/* Chat session name */}
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className="text-red-400 hover:text-red-300 transition duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg> {/* Delete chat button */}
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
              New Chat {/* New chat button */}
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Logout {/* Logout button */}
            </button>
          </div>
        </>
      )}
    </div>
  );
}