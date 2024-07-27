import io from 'socket.io-client';
import { renderMessage } from '@/components/MessageHandler';

export const socket = io();

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('chat message', ({ sessionId, userMessage, assistantMessage, model }) => {
  const chatSessionsList = document.getElementById('chat-sessions');
  const chatWindow = document.getElementById('chat-window');
  if (chatSessionsList.dataset.activeSessionId === sessionId) {
    renderMessage(userMessage, 'user');
    renderMessage(assistantMessage, 'assistant', model);
  }
});

export const sendMessage = (message, model) => {
  const chatSessionsList = document.getElementById('chat-sessions');
  const userInput = document.getElementById('user-input');
  const activeSessionId = chatSessionsList.dataset.activeSessionId;
  if (!activeSessionId || !message) return;
  userInput.value = '';
  socket.emit('chat message', { sessionId: activeSessionId, message, selectedModel: model });
};
