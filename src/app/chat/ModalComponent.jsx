"use client";

// Import useState hook from React
import { useState } from 'react';

const ModalComponent = () => {
  // State to manage the modal's open/close status
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the modal's open/close status
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Button to toggle the modal */}
      <button onClick={toggleModal}>Toggle Modal</button>
      {isOpen && (
        <div className="modal">
          {/* Modal content */}
          <p>This is a modal</p>
          {/* Button to close the modal */}
          <button onClick={toggleModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ModalComponent;
