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
    name: 'Generate Code',
    content: 'Generate a {{language}} code snippet to {{task}}.\n\n{{requirements}}',
  },
  {
    id: 4,
    name: 'Self-Consistency Problem Solving',
    category: 'Problem Solving',
    content: `Problem: {{problem_statement}}

Generate three different approaches to solve this problem:

Approach 1:
{{approach_1}}

Approach 2:
{{approach_2}}

Approach 3:
{{approach_3}}

Now, analyze these approaches and provide a synthesized solution that combines the best elements of each:

Synthesized Solution:
{{synthesized_solution}}

Explain why this synthesized solution is the most effective approach to the problem.`,
  },
  {
    id: 5,
    name: 'Self-Consistency Problem Solving',
    content: `Problem: {{problem_statement}}
  
  Generate three different approaches to solve this problem:
  
  Approach 1:
  {{approach_1}}
  
  Approach 2:
  {{approach_2}}
  
  Approach 3:
  {{approach_3}}
  
  Now, analyze these approaches and provide a synthesized solution that combines the best elements of each:
  
  Synthesized Solution:
  {{synthesized_solution}}
  
  Explain why this synthesized solution is the most effective approach to the problem.`,
  },
  {
    id: 6,
    name: 'Research Paper Analysis - Step 1',
    content: `Analyze the following research paper abstract:
  
  {{file_reference}}
  
  1. Identify the main research question:
  {{research_question}}
  
  2. List the key methodologies used:
  {{methodologies}}
  
  3. Summarize the main findings:
  {{findings}}`,
  },
  {
    id: 7,
    name: 'Research Paper Analysis - Step 2',
    content: `Based on the previous analysis:
  
  Research Question: {{research_question}}
  Methodologies: {{methodologies}}
  Findings: {{findings}}
  
  Now, perform the following tasks:
  
  1. Evaluate the strengths and weaknesses of the methodology:
  {{methodology_evaluation}}
  
  2. Discuss potential implications of the findings:
  {{implications}}
  
  3. Suggest areas for further research:
  {{further_research}}`,
  },
  {
    id: 8,
    name: 'Chain-of-Thought Problem Solving',
    content: `Problem: {{problem_statement}}
  
  Let's approach this step-by-step:
  
  1. Understand the given information:
     {{given_information}}
  
  2. Identify the key elements:
     {{key_elements}}
  
  3. Formulate a plan:
     {{solution_plan}}
  
  4. Execute the plan:
     {{solution_execution}}
  
  5. Verify the solution:
     {{solution_verification}}
  
  6. Conclusion:
     {{conclusion}}
  
  Now, provide a detailed explanation for each step.`,
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