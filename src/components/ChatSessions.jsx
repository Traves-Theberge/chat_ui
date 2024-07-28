"use client"; // Indicates that this file is a client-side module

import { useState } from 'react'; // Import the useState hook from React

// Define the ChatSessions component
const ChatSessions = () => {
  const [sessions, setSessions] = useState([]); // State to manage chat sessions

  // Fetch chat sessions logic

  return (
    <div className="chat-sessions"> {/* Container div for chat sessions */}
      {sessions.map((session) => (
        <div key={session.id} className="chat-session"> {/* Individual chat session */}
          {session.name} {/* Display session name */}
        </div>
      ))}
    </div>
  );
};

export default ChatSessions; // Export the ChatSessions component
