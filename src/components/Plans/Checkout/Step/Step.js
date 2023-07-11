import React from 'react';

const displayBlockStyle = {
  display: 'block',
};

export const Step = ({ children, title, active, stepNumber, complete, lastStep, onActivate }) => {
  return (
    <>
      <li
        className={`dp-box-shadow ${active || complete ? 'dp-form-successful' : ''} ${
          active ? 'dp-steps-payment-process' : ''
        }`}
      >
        <span
          className={`dp-number-item ${active ? ' dp-successful' : complete ? 'dp-checked' : ''}`}
        >
          {active || !complete ? stepNumber : ''}
        </span>
        <label className="dp-accordion-thumb">{title}</label>
        {(!active || lastStep) && complete ? (
          <button className="m-b-30 dp-edit-form" onClick={onActivate}>
            <span className="ms-icon icon-edit"></span>
          </button>
        ) : null}
        {active ? (
          <div className="dp-accordion-panel" style={displayBlockStyle}>
            <div className="dp-accordion-content">{children}</div>
          </div>
        ) : null}
      </li>
    </>
  );
};
