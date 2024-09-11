import OpenAI from 'openai';
import { formatResponse, handleApiError } from '@/utils/apiUtils';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { message, chatId, model } = req.body;

    const response = await openai.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
    });

    res.status(200).json(response.choices[0].message.content);
  } catch (error) {
    handleApiError(error, res);
  }
}