import { create } from 'zustand'; // Import the create function from 'zustand' for state management
import supabase from '@/utils/supabaseClient'; // Import the Supabase client from the utility file

// Define the useChatStore hook using create from 'zustand'
const useChatStore = create((set, get) => ({
  // Initial state properties
  currentChat: null, // The current chat session ID
  messages: [], // Array to hold chat messages
  chats: [], // Array to hold chat sessions
  model: 'gpt-4o-mini', // The model for chat interactions
  messageInput: '', // New state for the message input
  applyTemplate: null, // New state for the applied template
  selectedTemplate: null, // New state for the selected template
  
  // Action to set the current chat session ID
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
  // Action to set the model for chat interactions
  setModel: (model) => set({ model }), // Updated to set the model
  
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
    const { messages, currentChat, selectedTemplate } = get(); // Get the current state
    // Prepare the new message with the current chat session ID, timestamp, and file information
    const newMessage = {
      ...message,
      session_id: currentChat,
      created_at: new Date().toISOString(),
      file: message.file // Add this line
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
  
  // Function to create a new chat session
  createChat: async (chatName) => {
    try {
      // Check if a chat with the same name already exists
      const { data: existingChats, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('session_name', chatName)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingChats && existingChats.length > 0) {
        throw new Error('A chat with this name already exists');
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({ session_name: chatName })
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ chats: [data, ...state.chats] }));
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },
  
  // New action to set the message input
  setMessageInput: (input) => set({ messageInput: input }),
  
  // New action to apply a prompt template
  applyTemplate: (template) => {
    try {
      if (!template || typeof template !== 'string') {
        throw new Error('Invalid template');
      }
      set({ messageInput: template });
    } catch (error) {
      console.error('Error applying template:', error.message);
      // Optionally, you can set an error state or show a notification to the user
    }
  },
  
  // New action to set the applied template
  setApplyTemplate: (template) => {
    if (typeof template === 'string' && template.trim() !== '') {
      set({ applyTemplate: template });
    } else {
      console.error('Invalid template: Template must be a non-empty string');
    }
  },
  
  // New action to set the selected template
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  
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
  
  // Function to create a new chat session
  createChat: async (chatName) => {
    try {
      // Check if a chat with the same name already exists
      const { data: existingChats, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('session_name', chatName)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingChats && existingChats.length > 0) {
        throw new Error('A chat with this name already exists');
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({ session_name: chatName })
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ chats: [data, ...state.chats] }));
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },
  
  // New function to prepare chat history for download
  prepareDownload: (format = 'txt') => {
    const { messages, currentChat } = get();
    let content, mimeType;

    switch (format) {
      case 'json':
        content = JSON.stringify(messages, null, 2);
        mimeType = 'application/json';
        break;
      case 'csv':
        content = messages.map(msg => `${msg.sender},${msg.content}`).join('\n');
        mimeType = 'text/csv';
        break;
      default:
        content = messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n\n');
        mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    return { url, filename: `chat_history_${currentChat}.${format}` };
  },
}));

export default useChatStore; // Export the useChatStore hook