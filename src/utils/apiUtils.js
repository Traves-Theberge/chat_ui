import supabase from '@/utils/supabaseClient';

export const formatResponse = (content) => ({
  content: content.trim(),
});

export const handleApiError = (error, res) => {
  console.error('API error:', error);
  res.status(500).json({ error: 'An error occurred while processing your request' });
};