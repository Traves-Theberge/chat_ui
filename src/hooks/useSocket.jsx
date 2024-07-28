import { useEffect, useState } from 'react'; // Import useEffect and useState hooks from React
import io from 'socket.io-client'; // Import socket.io-client

// Custom hook to manage socket connection
export function useSocket(url) {
  const [socket, setSocket] = useState(null); // State to store the socket instance

  useEffect(() => {
    const socketIo = io(url); // Initialize socket connection

    setSocket(socketIo); // Set the socket instance in state

    return () => {
      socketIo.disconnect(); // Cleanup function to disconnect the socket
    };
  }, [url]); // Dependency array to re-run the effect when the URL changes

  return socket; // Return the socket instance
}