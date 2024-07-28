import useSWR from 'swr';
import supabase from './supabaseClient';

const fetcher = async (key) => {
  const [table, query] = key.split('/');
  const { data, error } = await supabase.from(table).select(query);
  if (error) throw error;
  return data;
};

export function useChats() {
  const { data, error, mutate } = useSWR('chat_sessions/*', fetcher);
  return {
    chats: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useMessages(chatId) {
  const { data, error, mutate } = useSWR(chatId ? `conversations/*, session_id=${chatId}` : null, fetcher);
  return {
    messages: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}