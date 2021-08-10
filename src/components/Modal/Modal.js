import React from 'react';

const Modal = ({ isOpen, handleClose, children }) => {
  if (!isOpen) {
    return <></>;
  }

  return (
    <div className="modal" data-testid="modal">
      <div className="modal-content--medium">
        <span onClick={handleClose} className="close" />
        {children}
      </div>
    </div>
  );
};

export default Modal;
