"use client";

export default function ChatMessages({ messages }) {
  return (
    <div className="flex-grow p-4 overflow-y-auto bg-gray-900">
      {messages.map((message, index) => (
        <div key={index} className={`mb-2 p-2 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'} rounded`}>
          {message.text}
        </div>
      ))}
    </div>
  );
}
