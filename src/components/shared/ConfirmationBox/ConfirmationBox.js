import React from 'react';
import PropTypes from 'prop-types';
import { StyledConfirmationBoxLogo } from './ConfirmationBox.styles';

export const ConfirmationBox = ({
  logo,
  title,
  description,
  paragraph,
  cancelButtonText,
  actionButtonText,
  onCancel,
  onAction,
}) => {
  return (
    <div className="dp-container" data-testid="confirmation-box">
      <div className="dp-rowflex">
        <div className="col-sm-12">
          <div className="dp-icon-modal">
            <StyledConfirmationBoxLogo src={logo} alt="confirmation box logo" />
          </div>
        </div>
        <div className="col-sm-12">
          <div className="dp-nolist-content">
            <h1>{title}</h1>
            {React.isValidElement(description) ? description : <p>{description}</p>}

            {paragraph ? <span className="dp-cta-paragraph">{paragraph}</span> : null}
            <hr />
            <div className="dp-cta-modal">
              <button
                type="button"
                className="dp-button button-medium primary-grey"
                onClick={onCancel}
              >
                {cancelButtonText}
              </button>
              <button
                type="button"
                className="dp-button button-medium primary-green"
                onClick={onAction}
              >
                {actionButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
ConfirmationBox.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  paragraph: PropTypes.string,
  cancelButtonText: PropTypes.string.isRequired,
  actionButtonText: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
};
