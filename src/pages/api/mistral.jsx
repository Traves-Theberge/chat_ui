import MistralClient from '@mistralai/mistralai'; // Import MistralClient from the Mistral AI library

const mistral = new MistralClient(process.env.MISTRAL_API_KEY); // Initialize MistralClient with the API key from environment variables

// Define the API route handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model } = req.body;

    if (!messages || !Array.isArray(messages) || !model) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const completion = await mistral.chat({
      model: model,
      messages: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
    });

    res.status(200).json({ content: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Mistral API error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}