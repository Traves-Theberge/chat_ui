// Function to initialize models for generating messages
const initializeModels = async () => {
  // Function to format messages for model input
  const formatMessages = (messages, template) => {
    // Map through each message and return a new object with role and content
    const appliedMessages = applyTemplate(messages, template);
    return appliedMessages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant', // Determine the role based on the message
      content: m.content // Content of the message
    }));
  };

  const applyTemplate = (messages, template) => {
    if (!template || messages.length === 0) return messages;
    
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role !== 'user') return messages;

    const filledTemplate = template.replace('{{message}}', lastUserMessage.content);
    return [...messages.slice(0, -1), { ...lastUserMessage, content: filledTemplate }];
  };

  try {
    // Object for OpenAI model interactions
    const openai = {
      // Function to generate a message using OpenAI
      generateMessage: async (messages, model, template) => {
        // Format the messages for the model
        const formattedMessages = formatMessages(messages, template);
        // Send a POST request to the OpenAI API
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
          },
          body: JSON.stringify({ messages: formattedMessages, model }), // Send the formatted messages and model in the request body
        });
        // Check if the response was successful
        if (!response.ok) {
          // If not, parse the error data from the response
          const errorData = await response.json();
          // Throw an error with the error message or a default message
          throw new Error(errorData.error || 'Failed to generate OpenAI response');
        }
        // If the response was successful, parse the data
        const data = await response.json();
        // Return the content of the response
        return data.content;
      }
    };

    // Object for Mistral model interactions
    const mistral = {
      // Function to generate a message using Mistral
      generateMessage: async (messages, model, template) => {
        // Format the messages for the model
        const formattedMessages = formatMessages(messages, template);
        // Send a POST request to the Mistral API
        const response = await fetch('/api/mistral', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
          },
          body: JSON.stringify({ messages: formattedMessages, model }), // Send the formatted messages and model in the request body
        });
        // Check if the response was successful
        if (!response.ok) {
          // If not, parse the error data from the response
          const errorData = await response.json();
          // Throw an error with the error message or a default message
          throw new Error(errorData.error || 'Failed to generate Mistral response');
        }
        // If the response was successful, parse the data
        const data = await response.json();
        // Return the content of the response
        return data.content;
      }
    };

    // Return the objects for OpenAI and Mistral model interactions
    return { openai, mistral };
  } catch (error) {
    // Log any errors that occur during model initialization
    console.error('Error initializing models:', error);
    // Rethrow the error to handle it further up the call stack
    throw error;
  }
};

// Export the initializeModels function as the default export
export default initializeModels;