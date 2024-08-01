"use client"; // Indicates that this file is a client-side module

// Define the ModelSelector component
import useChatStore from '@/store/chatStore';

export default function ModelSelector() {
  const { model, setModel } = useChatStore(state => ({ model: state.model, setModel: state.setModel }));

  // List of available models
  const models = {
    OpenAI: [
      'gpt-4o', // 128,000 tokens	Up to Oct 2023
      'gpt-4o-mini', // 128,000 tokens	Up to Oct 2023
      'gpt-4-turbo', // 128,000 tokens	Up to Dec 2023
      'gpt-3.5-turbo' // 16,385 tokens	Up to Sep 2021
    ],
    Mistral: [
      'mistral-tiny-latest', // 128,000 tokens
      'mistral-small-latest', // 128,000 tokens
      'mistral-medium-latest', // 128,000 tokens
      'mistral-large-latest', // 128,000 tokens
      'open-mistral-nemo', // 128,000 tokens
      'codestral-latest', // 32,000 tokens
    ]
  };

  // Function to handle model change
  const handleModelChange = (e) => {
    const selectedModel = e.target.value; // Get the selected model
    setModel(selectedModel); // Update the model state
  };

  return (
    // Dropdown select element for model selection
    <select 
      value={model} 
      onChange={handleModelChange} 
      className="bg-gray-800 text-white rounded-lg p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    >
      {Object.entries(models).map(([provider, modelOptions]) => (
        <optgroup key={provider} label={provider} className="bg-gray-700">
          {modelOptions.map((modelOption) => (
            <option key={modelOption} value={modelOption} className="bg-gray-800">
              {modelOption} {/* Display model option */}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}