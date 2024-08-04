import MistralClient from '@mistralai/mistralai';
import { applyTemplate, formatResponse, handleApiError } from '@/utils/apiUtils';

const mistral = new MistralClient(process.env.MISTRAL_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model, template } = req.body;
    const processedMessages = template ? applyTemplate(messages, template.content) : messages;

    console.log(`POST /api/mistral/${model}`);

    if (!processedMessages || !Array.isArray(processedMessages) || !model) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const completion = await mistral.chat({
      model: model,
      messages: processedMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
    });

    res.status(200).json(formatResponse(completion.choices[0].message.content, template?.name));
  } catch (error) {
    handleApiError(error, res);
  }
}