import create from 'zustand';
import supabase from '@/utils/supabaseClient';

const useChatStore = create((set, get) => ({
  currentChat: null,
  messages: [],
  model: 'default',
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
  setModel: (model) => set({ model }),
  fetchMessages: async (chatId) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('session_id', chatId)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      set({ messages: data || [] });
    }
  },
  sendMessage: async (message) => {
    const { currentChat, model } = get();
    if (!currentChat) return;

    const newMessage = { content: message, sender: 'user', session_id: currentChat };
    const { data, error } = await supabase.from('conversations').insert(newMessage).select();
    
    if (error) {
      console.error('Error inserting message:', error);
      return;
    }

    set(state => ({ messages: [...state.messages, data[0]] }));
  },
}));

export default useChatStore;