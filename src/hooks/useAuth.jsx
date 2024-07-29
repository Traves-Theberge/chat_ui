import { useState, useEffect } from 'react'; // Import useState and useEffect hooks from 'react'
import supabase from '@/utils/supabaseClient'; // Import supabase from the utility file

export default function useAuth() {
  const [session, setSession] = useState(null); // State to store the current session
  const [loading, setLoading] = useState(true); // State to manage the loading state

  useEffect(() => {
    // Function to get the current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession(); // Get the session from supabase
      setSession(session); // Update the session state
      setLoading(false); // Set loading to false after session is fetched
    };

    getSession(); // Call getSession function

    // Listen for changes in the authentication state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // Update the session state on change
      setLoading(false); // Set loading to false on change
    });

    // Cleanup function to unsubscribe from the auth state change listener
    return () => subscription.unsubscribe();
  }, []);

  return { session, loading }; // Return the session and loading states
}