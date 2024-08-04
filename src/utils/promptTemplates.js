export const defaultTemplates = [
  {
    id: 1,
    name: 'Basic Prompt',
    content: 'Please provide a detailed response to the following prompt:\n\n{{prompt}}',
  },
  {
    id: 2,
    name: 'Code Explanation',
    content: 'Explain the following code:\n\n```{{language}}```\n\nFile: {{file_reference}}\n\nProvide a detailed explanation of what this code does and how it works.',
  },
  {
    id: 3,
    name: 'Summarize Article',
    content: 'Summarize the following article:\n\n{{article_url}}\n\nProvide a concise summary of the main points and key takeaways.',
  },
  {
    id: 4,
    name: 'Generate Code',
    content: 'Generate a {{language}} code snippet to {{task}}.\n\n{{requirements}}',
  },
  {
    id: 5,
    name: 'Chat',
    content: 'You are a helpful assistant. Respond to the following message:\n\n{{message}}',
  },
];

export const parsePlaceholders = (templateContent) => {
  const placeholderRegex = /{{(\w+)(?::(\w+))?}}/g;
  const placeholders = [];
  let match;
  while ((match = placeholderRegex.exec(templateContent)) !== null) {
    placeholders.push({
      key: match[1],
      type: match[2] || 'text'
    });
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