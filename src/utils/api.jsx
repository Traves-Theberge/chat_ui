import useSWR from 'swr'; // Import the useSWR hook from the swr library
import supabase from './supabaseClient'; // Import the supabase client

// Define the fetcher function to fetch data from supabase
const fetcher = async (key) => {
  const [table, query] = key.split('/'); // Split the key into table and query
  const { data, error } = await supabase.from(table).select(query); // Fetch data from the specified table with the query
  if (error) throw error; // Throw an error if there is one
  return data; // Return the fetched data
};

// Custom hook to fetch chat sessions
export function useChats() {
  const { data, error, mutate } = useSWR('chat_sessions/*', fetcher); // Use the useSWR hook with the fetcher function
  return {
    chats: data, // Return the fetched chat sessions
    isLoading: !error && !data, // Return loading state
    isError: error, // Return error state
    mutate, // Return the mutate function to revalidate the data
  };
}

// Custom hook to fetch messages for a given chatId
export function useMessages(chatId) {
  const { data, error, mutate } = useSWR(chatId ? `conversations/*, session_id=${chatId}` : null, fetcher); // Use the useSWR hook with the fetcher function
  return {
    messages: data, // Return the fetched messages
    isLoading: !error && !data, // Return loading state
    isError: error, // Return error state
    mutate, // Return the mutate function to revalidate the data
  };
}