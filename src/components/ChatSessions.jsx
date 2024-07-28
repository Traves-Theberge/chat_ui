"use client";

import { useState } from 'react';

const ChatSessions = () => {
  const [sessions, setSessions] = useState([]);

  // Fetch chat sessions logic

  return (
    <div className="chat-sessions">
      {sessions.map((session) => (
        <div key={session.id} className="chat-session">
          {session.name}
        </div>
      ))}
    </div>
  );
};

export default ChatSessions;
