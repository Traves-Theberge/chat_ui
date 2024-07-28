import OpenAI from 'openai'; // Import OpenAI from the openai library

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Initialize OpenAI with the API key from environment variables

// Define the API route handler
export default async function handler(req, res) {
  if (req.method === 'POST') { // Check if the request method is POST
    try {
      const { messages, model } = req.body; // Destructure messages and model from the request body
      console.log(`Using OpenAI model: ${model}`); // Log the model being used
      const completion = await openai.chat.completions.create({
        model: model || 'gpt-3.5-turbo', // Specify the model, default to 'gpt-3.5-turbo' if not provided
        messages: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })) // Map messages to the required format
      });
      res.status(200).json({ content: completion.choices[0].message.content.trim() }); // Respond with the trimmed content of the first choice
    } catch (error) {
      console.error('OpenAI API error:', error); // Log any errors
      res.status(500).json({ error: error.message || 'An error occurred while processing your request' }); // Respond with a 500 status and the error message
    }
  } else {
    res.setHeader('Allow', ['POST']); // Set the Allow header to indicate that only POST is allowed
    res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with a 405 status and a message indicating the method is not allowed
  }
}