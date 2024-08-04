import { defaultTemplates } from './promptTemplates';
import supabase from '@/utils/supabaseClient';

export const applyTemplate = (messages, templateContent) => {
  if (!templateContent || messages.length === 0) return messages;
  
  const lastUserMessage = messages[messages.length - 1];
  if (lastUserMessage.role !== 'user') return messages;

  const filledTemplate = fillTemplate(templateContent, { message: lastUserMessage.content });
  return [...messages.slice(0, -1), { ...lastUserMessage, content: filledTemplate }];
};

export const formatResponse = (content, appliedTemplate) => ({
  content: content.trim(),
  appliedTemplate: appliedTemplate || null
});

export const handleApiError = (error, res) => {
  console.error('API error:', error);
  res.status(500).json({ error: 'An error occurred while processing your request' });
};

export const parsePlaceholders = (templateContent) => {
  const placeholderRegex = /{{(\w+)(?::(\w+))?}}/g;
  const placeholders = {};
  let match;
  while ((match = placeholderRegex.exec(templateContent)) !== null) {
    const type = match[1] === 'file_reference' ? 'file' : (match[2] || 'text');
    placeholders[match[1]] = { value: '', type };
  }
  return placeholders;
};

export const fillTemplate = (templateContent, values) => {
  let filledTemplate = templateContent;
  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}(?::\\w+)?}}`, 'g');
    filledTemplate = filledTemplate.replace(regex, value);
  });
  return filledTemplate;
};

export const fetchTemplatesFromSupabase = async () => {
  const { data, error } = await supabase
    .from('prompt_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addTemplateToSupabase = async (template) => {
  const { data, error } = await supabase
    .from('prompt_templates')
    .insert(template)
    .single();

  if (error) throw error;
  return data;
};

export const updateTemplateInSupabase = async (templateId, updatedTemplate) => {
  const { data, error } = await supabase
    .from('prompt_templates')
    .update(updatedTemplate)
    .match({ id: templateId })
    .single();

  if (error) throw error;
  return data;
};

export const deleteTemplateFromSupabase = async (templateId) => {
  const { error } = await supabase
    .from('prompt_templates')
    .delete()
    .match({ id: templateId });

  if (error) throw error;
};

export const fillTemplatePlaceholders = (template, placeholders) => {
  let filledTemplate = template;
  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(`{{${key}}`, 'g');
    filledTemplate = filledTemplate.replace(regex, value);
  }
  return filledTemplate;
};