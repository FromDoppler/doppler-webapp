import React from 'react';
import PropTypes from 'prop-types';
import { concatClasses } from '../../utils';

const Modal = ({ isOpen, type = 'medium', handleClose, className, children, modalId }) => {
  if (!isOpen) {
    return <></>;
  }

  return (
    <div className="modal" data-testid="modal" id={modalId ? modalId : ''}>
      <div className={concatClasses(`modal-content--${type}`, className)}>
        <span onClick={handleClose} className="close" data-testid="modal-close" />
        {children}
      </div>
    </div>
  );
};
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['small', 'medium', 'large', 'extra-large']),
  handleClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Modal;
