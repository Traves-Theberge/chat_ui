import React, { useState, useEffect } from 'react'; // Importing React and its hooks for state management and side effects
import { motion, AnimatePresence } from 'framer-motion'; // Importing motion and AnimatePresence from framer-motion for animations and presence management
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing FontAwesomeIcon for icons
import { faTimes, faEdit, faTrash, faPlus, faLightbulb, faSave, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Importing icons for close, edit, trash, plus, lightbulb, save, and info circle
import usePromptTemplateStore from '@/store/promptTemplateStore'; // Importing the usePromptTemplateStore hook for managing prompt templates
import PlaceholderFillModal from './PlaceholderFillModal'; // Importing the PlaceholderFillModal component
import { ToastContainer, toast } from 'react-toastify'; // Importing ToastContainer and toast from react-toastify for toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing react-toastify CSS for styling

const PromptTemplateModal = ({ isOpen, onClose, onApplyTemplate, isCollapsed }) => {
  const { templates, fetchTemplates, addTemplate, removeTemplate, updateTemplate } = usePromptTemplateStore(); // Destructuring the usePromptTemplateStore hook for template management

  useEffect(() => {
    fetchTemplates(); // Fetching templates on component mount
  }, [fetchTemplates]); // Dependency array for useEffect

  const [selectedTemplate, setSelectedTemplate] = useState(null); // State for the selected template
  const [editMode, setEditMode] = useState(false); // State for edit mode
  const [editedTemplate, setEditedTemplate] = useState({ name: '', content: '' }); // State for the edited template
  const [showPlaceholderModal, setShowPlaceholderModal] = useState(false); // State for showing the placeholder modal
  const [showGuide, setShowGuide] = useState(false); // State for showing the guide

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      setShowPlaceholderModal(true); // Show the placeholder modal if a template is selected
    }
  };

  const handlePlaceholdersFilled = (filledTemplate) => {
    onApplyTemplate(filledTemplate, selectedTemplate.name); // Applying the filled template
    setShowPlaceholderModal(false); // Closing the placeholder modal
    onClose(); // Closing the modal
  };

  const handleEditTemplate = (template) => {
    setEditedTemplate(template); // Setting the edited template
    setEditMode(true); // Entering edit mode
  };

  const handleSaveTemplate = async () => {
    if (!editedTemplate.name.trim() || !editedTemplate.content.trim()) {
      toast.error('Template name and content are required.'); // Error toast if name or content is empty
      return;
    }
    try {
      let updatedTemplate;
      if (editedTemplate.id) {
        updatedTemplate = await updateTemplate(editedTemplate.id, editedTemplate); // Updating the template
        toast.success('Template updated successfully'); // Success toast for update
      } else {
        updatedTemplate = await addTemplate(editedTemplate); // Adding a new template
        toast.success('Template added successfully'); // Success toast for add
      }
      setEditMode(false); // Exiting edit mode
      setEditedTemplate({ name: '', content: '' }); // Resetting the edited template state
      setSelectedTemplate(updatedTemplate); // Updating the selected template
      await fetchTemplates(); // Refreshing the template list
    } catch (error) {
      console.error('Error saving template:', error); // Logging the error
      toast.error('Failed to save template. Please try again.'); // Error toast for save failure
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await removeTemplate(templateId); // Deleting the template
        if (selectedTemplate && selectedTemplate.id === templateId) {
          setSelectedTemplate(null); // Resetting the selected template if it's the one being deleted
        }
        toast.success('Template deleted successfully'); // Success toast for delete
      } catch (error) {
        console.error('Error deleting template:', error); // Logging the error
        toast.error('Failed to delete template. Please try again.'); // Error toast for delete failure
      }
    }
  };

  // This is a memoized component for rendering a list of templates with actions
  const TemplateList = React.memo(({ templates, selectedTemplate, onSelect, onEdit, onDelete }) => (
    <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
      {templates.map((template) => {
        // Skipping rendering if template or id is missing
        if (!template || !template.id) return null; 
        return (
          <div
            key={template.id}
            className={`flex items-center justify-between p-2 rounded-md ${
              selectedTemplate && selectedTemplate.id === template.id
                ? 'bg-blue-600 text-white' // Styling for selected template
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600' // Styling for non-selected template
            }`}
          >
            <button onClick={() => onSelect(template)} className="flex-grow text-left">
              {template.name}
            </button>
            <div>
              <button
                onClick={() => onEdit(template)}
                className="p-1 text-gray-300 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => onDelete(template.id)}
                className="p-1 text-gray-300 hover:text-white transition-colors ml-2"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  ));

  // Add this line to set the display name for the TemplateList component
  TemplateList.displayName = 'TemplateList';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
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
            <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
              Prompt Templates
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="ml-2 text-gray-400 hover:text-white focus:outline-none"
              >
                <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5" />
              </button>
            </h2>
            {!editMode ? (
              <>
                <TemplateList
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                  onEdit={handleEditTemplate}
                  onDelete={handleDeleteTemplate}
                />
                <div className="flex justify-between mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditMode(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    New Template
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApplyTemplate}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center"
                    disabled={!selectedTemplate}
                  >
                    <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                    Select Template
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedTemplate.name}
                  onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value })}
                  placeholder="Template Name"
                  className="w-full p-3 border text-white bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={editedTemplate.content}
                  onChange={(e) => setEditedTemplate({ ...editedTemplate, content: e.target.value })}
                  placeholder="Template Content"
                  className="w-full p-3 border text-white bg-gray-700 border-gray-600 rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Save Template
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      {showPlaceholderModal && selectedTemplate && (
        <PlaceholderFillModal
          key="placeholder-modal"
          template={selectedTemplate}
          templateName={selectedTemplate.name}
          onClose={() => setShowPlaceholderModal(false)}
          onPlaceholdersFilled={handlePlaceholdersFilled}
          isNested={true} // Add this prop to indicate it's a nested modal
        />
      )}
      {showGuide && (
        <motion.div
          key="guide-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            key="guide-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 p-8 rounded-xl shadow-2xl relative max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowGuide(false)}
              aria-label="Close guide"
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-10 h-10 flex items-center justify-center rounded-full"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
            <div className="prose prose-invert max-w-none">
              <h1 className="text-4xl font-bold text-blue-400 mb-8">Building Prompt Templates</h1>
              
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-green-400 mb-4">Template Basics</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-gray-300">Use clear, descriptive names for your templates</li>
                  <li className="text-gray-300">Write your template content in the "Template Content" field</li>
                  <li className="text-gray-300">Use placeholders for dynamic content</li>
                </ul>
              </section>
              
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-green-400 mb-4">Placeholders</h2>
                <p className="text-gray-300 mb-2">Syntax: <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;placeholder_name&#125;&#125;</code></p>
                <p className="text-gray-300 mb-2">Examples:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-gray-300">Basic: <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;concept&#125;&#125;</code></li>
                  <li className="text-gray-300">Multiple: <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;topic1&#125;&#125;</code> and <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;topic2&#125;&#125;</code></li>
                  <li className="text-gray-300">Numbered: <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;number&#125;&#125;</code> advantages of <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;technology&#125;&#125;</code></li>
                </ul>
              </section>
              
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-green-400 mb-4">Special Placeholders</h2>
                <ol className="list-decimal pl-6 space-y-6">
                  <li className="text-gray-300">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">File Reference</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Syntax: <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;file_reference&#125;&#125;</code></li>
                      <li>Allows users to upload and include file contents</li>
                      <li>Supported formats: .txt, .html, .css, .js, .json, .xml, .md</li>
                    </ul>
                  </li>
                  <li className="text-gray-300">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">Longer Text</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Syntax: <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;text_passage&#125;&#125;</code></li>
                      <li>Use for multi-line text inputs</li>
                    </ul>
                  </li>
                  <li className="text-gray-300">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">Code Snippet</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Syntax: <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;language&#125;&#125; &#123;&#123;code_snippet&#125;&#125;</code></li>
                      <li>Specify the programming language and include a code block</li>
                    </ul>
                  </li>
                </ol>
              </section>
              
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-green-400 mb-4">File Required Feature</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-gray-300">Add ":file" to a placeholder to make it a file upload field</li>
                  <li className="text-gray-300">Example: <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;code_sample:file&#125;&#125;</code></li>
                  <li className="text-gray-300">Users will see an "Upload" button for this placeholder</li>
                </ul>
              </section>
              
              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-green-400 mb-4">Best Practices</h2>
                <ol className="list-decimal pl-6 space-y-2">
                  <li className="text-gray-300">Preview your template before saving</li>
                  <li className="text-gray-300">Use descriptive placeholder names</li>
                  <li className="text-gray-300">Combine different placeholder types for versatility</li>
                  <li className="text-gray-300">Update templates regularly to maintain relevance</li>
                </ol>
              </section>
              
              <section>
                <h2 className="text-3xl font-semibold text-green-400 mb-4">Troubleshooting</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-gray-300">Ensure correct placeholder syntax: <code className="bg-gray-700 px-2 py-1 rounded">&#123;&#123;placeholder_name&#125;&#125;</code></li>
                  <li className="text-gray-300">Check for typos in placeholder names</li>
                  <li className="text-gray-300">Verify file types for file upload placeholders</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

PromptTemplateModal.displayName = 'PromptTemplateModal';

export default PromptTemplateModal;