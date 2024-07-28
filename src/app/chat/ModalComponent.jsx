"use client";

import { useState } from 'react';

const ModalComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleModal}>Toggle Modal</button>
      {isOpen && (
        <div className="modal">
          <p>This is a modal</p>
          <button onClick={toggleModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ModalComponent;
