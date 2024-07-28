"use client"; // Indicates that this file is a client-side module

import { useState, useEffect } from 'react'; // Import useState and useEffect hooks from React
import supabase from '@/utils/supabaseClient'; // Import supabase client
import { debounce } from 'lodash'; // Import debounce function from lodash
import { toast } from 'react-toastify'; // Import toast function from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import ModalComponent from '@/app/chat/ModalComponent'; // Import ModalComponent

// Define the Sidebar component
export default function Sidebar({ setCurrentChat, currentChat }) {
  const [chats, setChats] = useState([]); // State to manage chat sessions
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar collapse
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close
  const [newChatName, setNewChatName] = useState(''); // State to store new chat name

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
    setIsModalOpen(true);
  };

  // Function to handle creating a new chat session
  const handleCreateChat = async () => {
    if (!newChatName.trim()) return; // Prevent creation of empty-named chats

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error('Error getting user session: ' + sessionError.message);
        return;
      }

      if (!session) {
        console.error('No session found');
        toast.error('No active user session. Please log in again.');
        return;
      }

      if (!session.user) {
        console.error('Session found, but no user:', session);
        toast.error('User information not available. Please log in again.');
        return;
      }

      console.log('Session user:', session.user);

      const { data: chatData, error: chatError } = await supabase.from('chat_sessions').insert({
        user_id: session.user.id,
        session_name: newChatName
      }).select();

      if (chatError) {
        console.error('Chat creation error:', chatError);
        toast.error('Error adding chat session: ' + chatError.message);
      } else if (chatData && chatData[0]) {
        setChats([...chats, chatData[0]]);
        setCurrentChat(chatData[0].id);
        toast.success('New chat session added successfully');
        setIsModalOpen(false);
        setNewChatName('');
      } else {
        console.error('No chat data returned:', chatData);
        toast.error('Error creating chat: No data returned');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
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
        {!isCollapsed && (
          <h1 className="text-xl font-semibold truncate">Chat History</h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-white hover:bg-gray-700 p-2 rounded-full transition-colors duration-200 ${isCollapsed ? 'ml-auto' : ''}`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <span onClick={() => setCurrentChat(chat.id)} className="truncate flex-grow">{chat.session_name}</span>
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className="text-gray-400 hover:text-red-400 transition duration-200 ml-2"
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Chat
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </>
      )}
      <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateChat}>
        <h2 className="text-2xl font-bold mb-4">Create New Chat</h2>
        <input
          type="text"
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          placeholder="Enter chat name"
          className="w-full p-2 border text-black border-gray-300 rounded-md mb-4"
        />
        <button 
          onClick={handleCreateChat}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Create
        </button>
      </ModalComponent>
    </div>
  );
}