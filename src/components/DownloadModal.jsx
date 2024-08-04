import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DownloadModal = ({ isOpen, onClose, onDownload }) => {
  const [format, setFormat] = useState('txt');
  const [filename, setFilename] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!filename.trim()) {
      toast.error('Filename is required.');
      return;
    }
    onDownload(format, filename);
    onClose();
    toast.success('Download started successfully');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            key="modal-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 p-8 rounded-xl shadow-2xl relative max-w-md w-full"
          >
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-10 h-10 flex items-center justify-center rounded-full"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
            <h2 className="text-3xl font-bold mb-6 text-white">Download Chat History</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="filename" className="block text-white mb-2">Filename:</label>
                <input
                  type="text"
                  id="filename"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="Enter filename"
                  className="w-full p-3 border text-white bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="format" className="block text-white mb-2">Format:</label>
                <select
                  id="format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-3 border text-white bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="txt">Text (.txt)</option>
                  <option value="json">JSON (.json)</option>
                  <option value="csv">CSV (.csv)</option>
                </select>
              </div>
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DownloadModal;