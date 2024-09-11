import { create } from 'zustand';
import supabase from '@/utils/supabaseClient';

const useChatStore = create((set, get) => ({
  currentChat: null,
  messages: [],
  chats: [],
  messageInput: '',
  userProgress: {},
  context: [],
  
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
  
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
    const { currentChat, userProgress, context } = get();
    try {
      console.log('Sending message:', message);
      
      // Insert message into Supabase
      const { data, error } = await supabase
        .from('conversations')
        .insert(message)
        .select();

      if (error) throw error;

      // If the message is from the user, get AI response
      if (message.sender === 'user') {
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message.content,
            chatId: currentChat,
            model: 'gpt-4o-mini',
            context: context,
            userProgress: userProgress,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('AI response received:', result);

        // Create and insert AI message
        const aiMessage = {
          content: result,
          sender: 'assistant',
          session_id: currentChat,
          created_at: new Date().toISOString()
        };

        await supabase
          .from('conversations')
          .insert(aiMessage);

        // No need to update local state here, as it's handled by the subscription
      }

      return data[0];
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },
  
  clearMessages: () => set({ messages: [] }),
  
  set: (fn) => set(fn),
  
  addChat: (newChat) => set((state) => {
    if (!state.chats.some(chat => chat.id === newChat.id)) {
      return { chats: [newChat, ...state.chats] };
    }
    return state;
  }),
  
  createChat: async (chatName) => {
    try {
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
  
  deleteMessage: async (messageId) => {
    const { messages, currentChat } = get();
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .match({ id: messageId, session_id: currentChat });

      if (error) throw error;

      set({ messages: messages.filter(msg => msg.id !== messageId) });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  },
  
  copyMessage: (message) => {
    navigator.clipboard.writeText(message.content);
  },
  
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
          console.log('New message received:', payload.new);
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  },
  
  clearPendingResponse: (chatId) => {
    set((state) => ({
      messages: state.messages.filter(msg => msg.session_id !== chatId || msg.status !== 'pending')
    }));
  },
  
  setMessageInput: (input) => set({ messageInput: input }),
  setUserProgress: (progress) => set({ userProgress: progress }),
  setContext: (newContext) => set({ context: newContext }),
}));

export default useChatStore;
