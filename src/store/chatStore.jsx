import { create } from 'zustand';
import supabase from '@/utils/supabaseClient';

const useChatStore = create((set, get) => ({
  currentChat: null,
  messages: [],
  chats: [],
  model: 'gpt-3.5-turbo',
  
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
  setModel: (model) => set({ model }),
  
  fetchMessages: async (chatId) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('session_id', chatId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      set({ messages: data || [] });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },
  
  fetchChats: async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ chats: data || [] });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  },
  
  sendMessage: async (message) => {
    const { messages, currentChat } = get();
    const newMessage = {
      ...message,
      session_id: currentChat,
      created_at: new Date().toISOString()
    };
    set({ messages: [...messages, newMessage] });
    try {
      const { error } = await supabase.from('conversations').insert(newMessage);
      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally, remove the message from the state if it failed to send
      set({ messages: messages });
    }
  },
  
  clearMessages: () => set({ messages: [] }),
  
  set: (fn) => set(fn),
  
  addChat: (newChat) => set((state) => {
    if (!state.chats.some(chat => chat.id === newChat.id)) {
      return { chats: [newChat, ...state.chats] };
    }
    return state;
  }),
}));

export default useChatStore;