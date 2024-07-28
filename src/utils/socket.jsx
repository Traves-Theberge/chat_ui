import io from 'socket.io-client'; // Import the socket.io-client library
import { renderMessage } from '@/components/MessageHandler'; // Import the renderMessage function from MessageHandler component

export const socket = io(); // Initialize the socket connection

// Event listener for socket connection
socket.on('connect', () => {
  console.log('Connected to WebSocket server'); // Log a message when connected to the WebSocket server
});

// Event listener for receiving chat messages
socket.on('chat message', ({ sessionId, userMessage, assistantMessage, model }) => {
  const chatSessionsList = document.getElementById('chat-sessions'); // Get the chat sessions list element
  const chatWindow = document.getElementById('chat-window'); // Get the chat window element
  if (chatSessionsList.dataset.activeSessionId === sessionId) { // Check if the active session ID matches the received session ID
    renderMessage(userMessage, 'user'); // Render the user message
    renderMessage(assistantMessage, 'assistant', model); // Render the assistant message with the model
  }
});

// Function to send a chat message
export const sendMessage = (message, model) => {
  const chatSessionsList = document.getElementById('chat-sessions'); // Get the chat sessions list element
  const userInput = document.getElementById('user-input'); // Get the user input element
  const activeSessionId = chatSessionsList.dataset.activeSessionId; // Get the active session ID
  if (!activeSessionId || !message) return; // If there is no active session ID or message, return
  userInput.value = ''; // Clear the user input field
  socket.emit('chat message', { sessionId: activeSessionId, message, selectedModel: model }); // Emit the chat message with the session ID and selected model
};
