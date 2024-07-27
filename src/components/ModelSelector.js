"use client";

export default function ModelSelector({ model, setModel }) {
  const models = ['gpt-3.5-turbo', 'mistral-tiny'];

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