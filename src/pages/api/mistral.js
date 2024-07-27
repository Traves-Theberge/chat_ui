import MistralClient from '@mistralai/mistralai';

const mistral = new MistralClient(process.env.MISTRAL_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { messages, model } = req.body;
      const completion = await mistral.chat({
        model: model || 'mistral-tiny',
        messages
      });
      res.status(200).json({ content: completion.choices[0].message.content.trim() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}