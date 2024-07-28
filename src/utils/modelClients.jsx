const initializeModels = async () => {
  // Function to format messages to the required structure
  const formatMessages = (messages) => {
    return messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));
  };

  try {
    // OpenAI model configuration
    const openai = {
      generateMessage: async (messages, model) => {
        const formattedMessages = formatMessages(messages); // Format the messages
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: formattedMessages, model }), // Send the formatted messages and model
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate OpenAI response'); // Handle errors
        }
        const data = await response.json();
        return data.content; // Return the generated content
      }
    };

    // Mistral model configuration
    const mistral = {
      generateMessage: async (messages, model) => {
        const formattedMessages = formatMessages(messages); // Format the messages
        const response = await fetch('/api/mistral', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: formattedMessages, model }), // Send the formatted messages and model
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate Mistral response'); // Handle errors
        }
        const data = await response.json();
        return data.content; // Return the generated content
      }
    };

    return { openai, mistral }; // Return the initialized models
  } catch (error) {
    console.error('Error initializing models:', error); // Log any errors
    throw error; // Rethrow the error
  }
};

export default initializeModels;