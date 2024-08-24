import { ElevenLabsClient } from 'elevenlabs';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const elevenlabs = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voiceId } = req.body;

    if (!text || !voiceId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const audio = await elevenlabs.generate({
      voice: voiceId,
      text,
      model_id: 'eleven_multilingual_v2'
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audio.byteLength);
    res.send(Buffer.from(audio));
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}