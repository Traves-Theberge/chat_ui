import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { messages, model } = req.body;
      const completion = await openai.chat.completions.create({
        model: model || 'gpt-3.5-turbo',
        messages: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
      });
      res.status(200).json({ content: completion.choices[0].message.content.trim() });
    } catch (error) {
      console.error('OpenAI API error:', error);
      res.status(500).json({ error: error.message || 'An error occurred while processing your request' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}