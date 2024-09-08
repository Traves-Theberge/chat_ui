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
    const { currentChat } = get();
    const { data, error } = await supabase
      .from('conversations')
      .insert({ ...message, session_id: currentChat })
      .single();

    if (error) {
      console.error('Error sending message:', error);
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
  
  // Updated deleteMessage function
  deleteMessage: async (messageId) => {
    const { messages, currentChat } = get();
    try {
      // Delete the message from Supabase
      const { error } = await supabase
        .from('conversations')
        .delete()
        .match({ id: messageId, session_id: currentChat });

      if (error) throw error;

      // Update the local state
      set({ messages: messages.filter(msg => msg.id !== messageId) });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  },
  
  // Function to copy a message
  copyMessage: (message) => {
    navigator.clipboard.writeText(message.content);
  },
  
  // Function to download a message
  downloadMessage: (message, format = 'txt') => {
    const { prepareDownload } = get();
    const { url, filename } = prepareDownload(format, [message]);
    const element = document.createElement('a');
    element.href = url;
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },
  
  // Updated prepareDownload function to handle single message
  prepareDownload: (format = 'txt', messagesToDownload = null) => {
    const { messages, currentChat } = get();
    const messagesToUse = messagesToDownload || messages;
    let content, mimeType, extension;
  
    switch (format) {
      case 'json':
        content = JSON.stringify(messagesToUse, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'csv':
        content = 'Sender,Content,Timestamp\n' + 
          messagesToUse.map(msg => `"${msg.sender}","${msg.content}","${msg.created_at}"`).join('\n');
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      default:
        content = messagesToUse.map(msg => `${msg.sender} (${new Date(msg.created_at).toLocaleString()}):\n${msg.content}\n`).join('\n');
        mimeType = 'text/plain';
        extension = 'txt';
    }
  
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    return { url, filename: `chat_history_${currentChat}.${extension}` };
  },
  
  // New function to subscribe to real-time message updates
  subscribeToMessages: (chatId) => {
    const channel = supabase
      .channel(`public:conversations:session_id=eq.${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversations' },
        (payload) => {
          set((state) => ({
            messages: [...state.messages, payload.new]
          }));
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  },
  
  // New function to clear pending responses
  clearPendingResponse: (chatId) => {
    set((state) => ({
      messages: state.messages.filter(msg => msg.session_id !== chatId || msg.status !== 'pending')
    }));
  },
  
  // New action to set the message input
  setMessageInput: (input) => set({ messageInput: input }),
})); 

export default useChatStore; // Export the useChatStore hook
