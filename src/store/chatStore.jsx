import { create } from 'zustand'; // Import the create function from 'zustand' for state management
import supabase from '@/utils/supabaseClient'; // Import the Supabase client from the utility file

// Define the useChatStore hook using create from 'zustand'
const useChatStore = create((set, get) => ({
  // Initial state properties
  currentChat: null, // The current chat session ID
  messages: [], // Array to hold chat messages
  chats: [], // Array to hold chat sessions
  model: 'gpt-3.5-turbo', // The model for chat interactions
  
  // Action to set the current chat session ID
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
  // Action to set the model for chat interactions
  setModel: (model) => set({ model }),
  
  // Function to fetch messages for a given chat session
  fetchMessages: async (chatId) => {
    try {
      // Query Supabase for messages related to the given chat session
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('session_id', chatId)
        .order('created_at', { ascending: true });
      if (error) throw error; // Throw the error if there's an issue with the query
      // Update the state with the fetched messages
      set({ messages: data || [] });
    } catch (error) {
      console.error('Error fetching messages:', error); // Log the error if it occurs
    }
  },
  
  // Function to fetch all chat sessions
  fetchChats: async () => {
    try {
      // Query Supabase for all chat sessions
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error; // Throw the error if there's an issue with the query
      // Update the state with the fetched chat sessions
      set({ chats: data || [] });
    } catch (error) {
      console.error('Error fetching chats:', error); // Log the error if it occurs
    }
  },
  
  // Function to send a new message
  sendMessage: async (message) => {
    const { messages, currentChat } = get(); // Get the current state
    // Prepare the new message with the current chat session ID and timestamp
    const newMessage = {
      ...message,
      session_id: currentChat,
      created_at: new Date().toISOString()
    };
    // Add the new message to the state
    set({ messages: [...messages, newMessage] });
    try {
      // Insert the new message into the database
      const { error } = await supabase.from('conversations').insert(newMessage);
      if (error) throw error; // Throw the error if there's an issue with the insertion
    } catch (error) {
      console.error('Error sending message:', error); // Log the error if it occurs
      // Optionally, remove the message from the state if it failed to send
      set({ messages: messages });
    }
  },
  
  // Function to clear all messages from the state
  clearMessages: () => set({ messages: [] }),
  
  // Function to update the state directly
  set: (fn) => set(fn),
  
  // Function to add a new chat session to the state
  addChat: (newChat) => set((state) => {
    // Check if the new chat session already exists in the state
    if (!state.chats.some(chat => chat.id === newChat.id)) {
      // If it doesn't exist, add it to the beginning of the chats array
      return { chats: [newChat, ...state.chats] };
    }
    // If it already exists, return the current state
    return state;
  }),
}));

export default useChatStore; // Export the useChatStore hook