import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import useChatStore from '@/store/chatStore';

const DownloadButton = ({ currentChat }) => {
  const prepareDownload = useChatStore(state => state.prepareDownload);
  const [format, setFormat] = useState('txt');
  const [customFilename, setCustomFilename] = useState('');

  const handleDownload = () => {
    if (!currentChat) return;
    const { url, filename } = prepareDownload(format);
    const a = document.createElement('a');
    a.href = url;
    a.download = customFilename || filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center">
      <select 
        value={format} 
        onChange={(e) => setFormat(e.target.value)}
        className="mb-2 p-2 rounded"
      >
        <option value="txt">Text (.txt)</option>
        <option value="json">JSON (.json)</option>
        <option value="csv">CSV (.csv)</option>
      </select>
      <input
        type="text"
        placeholder="Custom filename (optional)"
        value={customFilename}
        onChange={(e) => setCustomFilename(e.target.value)}
        className="mb-2 p-2 rounded"
      />
      <motion.button
        layout
        onClick={handleDownload}
        disabled={!currentChat}
        className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center h-10 ${
          currentChat ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
        whileHover={{ scale: currentChat ? 1.05 : 1 }}
        whileTap={{ scale: currentChat ? 0.95 : 1 }}
        initial={false}
      >
        <span className="mr-2">Download</span>
        <FontAwesomeIcon icon={faDownload} className="text-lg" style={{ width: '1em', height: '1em' }} />
      </motion.button>
    </div>
  );
};

export default DownloadButton;