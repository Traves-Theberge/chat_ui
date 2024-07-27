import MistralClient from '@mistralai/mistralai';

const mistral = new MistralClient(process.env.MISTRAL_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { messages, model } = req.body;
      console.log(`Using Mistral model: ${model}`);
      const completion = await mistral.chat({
        model: model,
        messages
      });
      res.status(200).json({ content: completion.choices[0].message.content.trim() });
    } catch (error) {
      console.error('Mistral API error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}