"use client";

export default function ModelSelector({ model, setModel }) {
  const models = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo-0125',
    'mistral-tiny',
    'mistral-small',
    'mistral-medium',
    'open-mistral-7b',
    'open-mixtral-8x7b',
    'open-mixtral-8x22b',
    'mistral-small-2402',
    'mistral-large-2402',
    'mistral-large-2407',
    'mistral-embed',
    'codestral-2405',
    'codestral-mamba-2407',
    'open-mistral-nemo'
  ];

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);
  };

  return (
    <select value={model} onChange={handleModelChange} className="bg-gray-700 text-white rounded p-2">
      {models.map((modelOption) => (
        <option key={modelOption} value={modelOption}>
          {modelOption}
        </option>
      ))}
    </select>
  );
}