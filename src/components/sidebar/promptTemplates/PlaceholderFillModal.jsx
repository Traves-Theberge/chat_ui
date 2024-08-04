import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { parsePlaceholders } from '@/utils/apiUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlaceholderFillModal = ({ template, templateName, onClose, onPlaceholdersFilled, isNested }) => {
  const [placeholders, setPlaceholders] = useState({});
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const extractedPlaceholders = parsePlaceholders(template.content);
    setPlaceholders(extractedPlaceholders);
  }, [template]);

  const handleInputChange = (key, value) => {
    setPlaceholders(prev => ({ ...prev, [key]: { ...prev[key], value } }));
    if (value.trim() !== '') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    } else {
      setErrors(prev => ({ ...prev, [key]: 'This field is required' }));
    }
  };

  const handleFileUpload = async (key, e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/json',
        'application/xml',
        'text/markdown'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only text-based files are supported at the moment.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        handleInputChange(key, file.name);
        setPlaceholders(prev => ({
          ...prev,
          [key]: { ...prev[key], fileContent: content }
        }));
      };
      reader.readAsText(file);
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    let isValid = true;
    Object.entries(placeholders).forEach(([key, { value }]) => {
      if (value.trim() === '') {
        newErrors[key] = 'This field is required';
        isValid = false;
      }
    });
    setErrors(newErrors);
    setIsValid(isValid);
    return isValid;
  };

  useEffect(() => {
    validateInputs();
  }, [placeholders]);

  const handleApply = () => {
    if (validateInputs()) {
      let filledTemplate = template.content;
      Object.entries(placeholders).forEach(([key, { value, fileContent, type }]) => {
        const regex = new RegExp(`{{${key}(?::\\w+)?}}`, 'g');
        if (type === 'file') {
          filledTemplate = filledTemplate.replace(regex, fileContent || `[File: ${value}]`);
        } else {
          filledTemplate = filledTemplate.replace(regex, value);
        }
      });
      onPlaceholdersFilled(filledTemplate);
    } else {
      toast.error('Please fill in all required fields.');
    }
  };

  const getPreview = () => {
    let preview = template.content;
    Object.entries(placeholders).forEach(([key, { value, fileContent, type }]) => {
      const regex = new RegExp(`{{${key}(?::\\w+)?}}`, 'g');
      if (type === 'file') {
        preview = preview.replace(regex, `[File: ${value}]`);
      } else {
        preview = preview.replace(regex, value || `[${key}]`);
      }
    });
    return preview;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isNested ? '' : 'bg-black bg-opacity-50'
      }`}
    >
      <motion.div
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
        <h2 className="text-3xl font-bold mb-6 text-white">{templateName}</h2>
        <div className="space-y-6 mb-6 max-h-60 overflow-y-auto">
          {Object.entries(placeholders).map(([key, { value, type }]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-2">{key}</label>
              <div className="flex">
                {type === 'file' ? (
                  <>
                    <input
                      type="text"
                      value={value}
                      readOnly
                      className="w-full p-3 bg-gray-700 text-white rounded-l-lg border-gray-600"
                      placeholder="No file selected"
                    />
                    <label className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-r-lg transition duration-200 cursor-pointer flex items-center">
                      Upload
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(key, e)}
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className={`w-full p-3 bg-gray-700 text-white rounded-lg ${
                      errors[key] ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder={`Enter ${key}`}
                  />
                )}
              </div>
              {errors[key] && <p className="text-red-500 text-sm mt-2">{errors[key]}</p>}
            </div>
          ))}
        </div>
        <div className="flex justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(!showPreview)}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={showPreview ? faEyeSlash : faEye} className="mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleApply}
            disabled={!isValid}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center ${
              !isValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Apply
          </motion.button>
        </div>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-gray-600 rounded-lg p-4 bg-gray-700"
          >
            {getPreview()}
          </motion.div>
        )}
      </motion.div>
      <ToastContainer position="bottom-right" />
    </motion.div>
  );
};

export default PlaceholderFillModal;