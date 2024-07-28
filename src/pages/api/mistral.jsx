import MistralClient from '@mistralai/mistralai'; // Import MistralClient from the Mistral AI library

const mistral = new MistralClient(process.env.MISTRAL_API_KEY); // Initialize MistralClient with the API key from environment variables

// Define the API route handler
export default async function handler(req, res) {
  if (req.method === 'POST') { // Check if the request method is POST
    try {
      const { messages, model } = req.body; // Destructure messages and model from the request body
      console.log(`Using Mistral model: ${model}`); // Log the model being used
      const completion = await mistral.chat({
        model: model, // Specify the model
        messages // Pass the messages
      });
      res.status(200).json({ content: completion.choices[0].message.content.trim() }); // Respond with the trimmed content of the first choice
    } catch (error) {
      console.error('Mistral API error:', error); // Log any errors
      res.status(500).json({ error: error.message }); // Respond with a 500 status and the error message
    }
  } else {
    res.setHeader('Allow', ['POST']); // Set the Allow header to indicate that only POST is allowed
    res.status(405).end(`Method ${req.method} Not Allowed`); // Respond with a 405 status and a message indicating the method is not allowed
  }
}