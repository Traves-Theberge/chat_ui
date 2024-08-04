import OpenAI from 'openai';
import { applyTemplate, formatResponse, handleApiError } from '@/utils/apiUtils';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { messages, model, template } = req.body;
    const processedMessages = template ? applyTemplate(messages, template.content) : messages;

    console.log(`POST /api/openai/${model}`);

    const response = await openai.chat.completions.create({
      model: model,
      messages: processedMessages,
    });

    res.status(200).json(formatResponse(response.choices[0].message.content, template?.name));
  } catch (error) {
    handleApiError(error, res);
  }
}