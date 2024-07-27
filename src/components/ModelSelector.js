"use client";

export default function ModelSelector({ model, setModel }) {
  const models = ['default', 'gpt-3.5-turbo', 'gpt-4'];

  return (
    <select value={model} onChange={(e) => setModel(e.target.value)} className="bg-gray-700 text-white rounded p-2">
      {models.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
    </select>
  );
}
