const initializeModels = async () => {
  const formatMessages = (messages) => {
    return messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));
  };

  try {
    const openai = {
      generateMessage: async (messages, model) => {
        const formattedMessages = formatMessages(messages);
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: formattedMessages, model }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate OpenAI response');
        }
        const data = await response.json();
        return data.content;
      }
    };

    const mistral = {
      generateMessage: async (messages, model) => {
        const formattedMessages = formatMessages(messages);
        const response = await fetch('/api/mistral', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: formattedMessages, model }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate Mistral response');
        }
        const data = await response.json();
        return data.content;
      }
    };

    return { openai, mistral };
  } catch (error) {
    console.error('Error initializing models:', error);
    throw error;
  }
};

export default initializeModels;