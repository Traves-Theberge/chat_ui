"use client"; // Indicates that this file is a client-side module
import { useEffect, useRef, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Define the ChatMessages component
export default function ChatMessages({ messages, isLoading, partialResponse }) {
  const [groupedMessages, setGroupedMessages] = useState([]); // State to store grouped messages
  const messagesEndRef = useRef(null);

  // Effect to group messages when messages change
  useEffect(() => {
    const groupMessages = () => {
      const grouped = [];
      let currentGroup = [];
      messages.forEach((message, index) => {
        if (index === 0 || message.sender !== messages[index - 1].sender) {
          if (currentGroup.length > 0) {
            grouped.push(currentGroup);
          }
          currentGroup = [message];
        } else {
          currentGroup.push(message);
        }
      });
      if (currentGroup.length > 0) {
        grouped.push(currentGroup);
      }
      setGroupedMessages(grouped);
    };

    groupMessages();
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupedMessages, partialResponse]);

  return (
    // Container for chat messages
    <div className="flex flex-col flex-grow overflow-y-auto p-4 overflow-x-hidden">
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400" />
        </div>
      )}
      {/* Render grouped messages */}
      {groupedMessages.map((group, groupIndex) => (
        <MessageGroup key={groupIndex} messages={group} />
      ))}
      {partialResponse && <MessageBubble message={{ sender: 'AI', content: partialResponse }} />}
      <div ref={messagesEndRef} />
    </div>
  );
}

function MessageGroup({ messages }) {
  const sender = messages[0].sender;
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="flex flex-col">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} isGrouped={index !== 0} />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, isGrouped }) {
  const [showActions, setShowActions] = useState(false);

  // Pre-process the message content
  const processedContent = useMemo(() => {
    // Add any pre-processing logic here
    return message.content;
  }, [message.content]);

  return (
    <div
      className={`relative max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl rounded-2xl p-4 
        ${message.sender === 'user' 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white self-end' 
          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white self-start'} 
        shadow-lg 
        ${isGrouped ? 'mt-1' : 'mt-3'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <ReactMarkdown
        className="text-sm md:text-base leading-relaxed break-words"
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} bg-gray-800 rounded px-1`} {...props}>
                {children}
              </code>
            );
          },
          // Add custom renderers for other elements if needed
          p: ({ children }) => <p className="mb-2">{children}</p>,
          ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
      <div className="flex justify-between items-center mt-3">
        <p className="text-xs opacity-70 mr-2">
          {message.sender === 'user' ? 'You' : 'AI'}
        </p>
        <p className="text-xs opacity-70 ml-2">
          {new Date(message.created_at).toLocaleTimeString()}
        </p>
      </div>
      {showActions && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button onClick={() => navigator.clipboard.writeText(message.content)} className="text-xs bg-gray-800 p-1 rounded">Copy</button>
        </div>
      )}
    </div>
  );
}
