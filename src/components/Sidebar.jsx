"use client"; // Indicates that this file is a client-side module

import { useState, useEffect } from 'react'; // Import useState and useEffect hooks from React
import supabase from '@/utils/supabaseClient'; // Import supabase client
import { debounce } from 'lodash'; // Import debounce function from lodash
import { toast } from 'react-toastify'; // Import toast function from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import useChatStore from '@/store/chatStore'; // Import useChatStore
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faComment, faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

// Define the ModalComponent
const ModalComponent = ({ isOpen, onClose, onSubmit, children }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-lg shadow-xl relative max-w-md w-full"
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-300 hover:text-white transition-colors z-10 p-2 rounded-full bg-gray-700 bg-opacity-60 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
            <div onKeyDown={handleKeyDown} className="mt-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Define the Sidebar component
export default function Sidebar({ setCurrentChat, currentChat, onChatDelete }) {
  const { chats, fetchChats } = useChatStore((state) => ({ 
    chats: state.chats,
    fetchChats: state.fetchChats
  })); // Use useChatStore to manage chat sessions
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar collapse
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close
  const [newChatName, setNewChatName] = useState(''); // State to store new chat name

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

  const handleOpenNewChatModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle creating a new chat session
  const handleCreateChat = async () => {
    if (!newChatName.trim()) return;

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

      // Disable the submit button or add a loading state here
      setIsModalOpen(false); // Close the modal immediately to prevent double submission

      const { data: chatData, error: chatError } = await supabase.from('chat_sessions').insert({
        user_id: session.user.id,
        session_name: newChatName.trim()
      }).select().single();

      if (chatError) {
        console.error('Chat creation error:', chatError);
        toast.error('Error adding chat session: ' + chatError.message);
      } else if (chatData) {
        // Use the addChat function from useChatStore to update the state
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

  const debouncedHandleCreateChat = debounce(handleCreateChat, 300);

  // Function to handle deleting a chat session
  const handleDeleteChat = async (chatId) => {
    const { error } = await supabase.from('chat_sessions').delete().eq('id', chatId); // Delete chat session by ID
    if (error) {
      toast.error('Error deleting chat session: ' + error.message); // Show error toast if deletion fails
    } else {
      fetchChats(); // Fetch updated chats after deleting one
      if (currentChat === chatId) {
        setCurrentChat(null); // Reset current chat if it was deleted
        onChatDelete(chatId); // Clear the messages for the deleted chat
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

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div 
      className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex justify-between items-center h-16">
        {!isCollapsed && (
          <h1 className="text-xl font-semibold truncate">Chat History</h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-white hover:bg-gray-700 p-2 rounded-full transition-colors duration-200 ${isCollapsed ? 'mx-auto' : ''}`}
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
      <div className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-2">
          {isLoading ? (
            <p className="text-gray-400">Loading chat sessions...</p>
          ) : Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setCurrentChat(chat.id)}
                className={`p-2 rounded-lg cursor-pointer transition duration-200 flex justify-between items-center ${
                  currentChat === chat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {isCollapsed ? (
                  <FontAwesomeIcon icon={faComment} className="mx-auto text-lg" />
                ) : (
                  <>
                    <span className="truncate flex-grow">{chat.session_name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                      className="text-gray-400 hover:text-red-400 transition duration-200 ml-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </>
                )}
              </div>
            ))
          ) : !isCollapsed && (
            <p className="text-gray-400">No chat sessions available.</p>
          )}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={handleOpenNewChatModal}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              title="New Chat"
            >
              <FontAwesomeIcon icon={faPlus} />
              {!isCollapsed && <span className="ml-2 flex-grow">New Chat</span>}
            </button>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              title="Logout"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              {!isCollapsed && <span className="ml-2 flex-grow">Logout</span>}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={debouncedHandleCreateChat}>
        <h2 className="text-2xl font-bold mb-4 text-white">Create New Chat</h2>
        <input
          type="text"
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          placeholder="Enter chat name"
          className="w-full p-3 border text-white bg-gray-700 border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              debouncedHandleCreateChat();
            }
          }}
        />
        <button
          onClick={debouncedHandleCreateChat}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          Submit
        </button>
      </ModalComponent>
    </div>
  );
}