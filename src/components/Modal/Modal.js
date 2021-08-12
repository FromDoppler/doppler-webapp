import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, type = 'medium', handleClose, children }) => {
  if (!isOpen) {
    return <></>;
  }

  return (
    <div className="modal" data-testid="modal">
      <div className={`modal-content--${type}`}>
        <span onClick={handleClose} className="close" />
        {children}
      </div>
    </div>
  );
};
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['small', 'medium', 'large']),
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
