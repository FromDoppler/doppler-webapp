import React from 'react';

const Modal = (props) => {
  if (!props.isOpen) {
    return <></>;
  }

  return (
    <div className="modal">
      <div className="modal-content--medium">
        <span onClick={props.handleClose} className="close" />
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
