import create from 'zustand'; // Import the create function from zustand
import supabase from '@/utils/supabaseClient'; // Import the supabase client

// Create the chat store using zustand
const useChatStore = create((set, get) => ({
  currentChat: null, // Initialize currentChat as null
  messages: [], // Initialize messages as an empty array
  model: 'default', // Initialize model with a default value
  // Function to set the current chat
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
  // Function to set the model
  setModel: (model) => set({ model }),
  // Function to fetch messages for a given chatId
  fetchMessages: async (chatId) => {
    const { data, error } = await supabase
      .from('conversations') // Select from the conversations table
      .select('*') // Select all columns
      .eq('session_id', chatId) // Filter by session_id
      .order('created_at', { ascending: true }); // Order by created_at in ascending order
    if (error) {
      console.error('Error fetching messages:', error); // Log any errors
    } else {
      set({ messages: data || [] }); // Set the messages state with the fetched data
    }
  },
  // Function to send a message
  sendMessage: async (message) => {
    const { currentChat, model } = get(); // Get the currentChat and model from the state
    if (!currentChat) return; // If there is no current chat, return

    const newMessage = { content: message, sender: 'user', session_id: currentChat }; // Create a new message object
    const { data, error } = await supabase.from('conversations').insert(newMessage).select(); // Insert the new message into the conversations table
    
    if (error) {
      console.error('Error inserting message:', error); // Log any errors
      return;
    }

    set(state => ({ messages: [...state.messages, data[0]] })); // Update the messages state with the new message
  },
}));

export default useChatStore; // Export the useChatStore hook