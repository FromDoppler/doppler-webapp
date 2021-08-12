import React from 'react';
import { useIntl } from 'react-intl';

/* TODO: These styles will be removed with the correct classes. Currently Gus is working with the layout. */
const displaFlexAndjustifyContentSpaceBetweenStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const titleStyle = {
  textTransform: 'uppercase',
  fontWeight: 400,
};

const displayBlockStyle = {
  display: 'block',
};

export const Step = ({ children, title, active, stepNumber, complete, onActivate }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <li className={`dp-box-shadow ${active || complete ? 'dp-form-successful' : ''}`}>
        <span className={`dp-number-item ${active || complete ? ' dp-successful' : ''}`}>
          {stepNumber}
        </span>
        <div className="dp-accordion-thumb" style={displaFlexAndjustifyContentSpaceBetweenStyle}>
          <div style={titleStyle}>{title}</div>
          {!active && complete ? (
            <button
              className="m-b-30 edit-button dp-accordion-thumb"
              onClick={onActivate}
              style={{ color: '#33ad73' }}
            >
              {_('checkoutProcessForm.edit')}
            </button>
          ) : null}
        </div>
        {active ? (
          <div className="dp-accordion-panel" style={displayBlockStyle}>
            <div className="dp-accordion-content">{children}</div>
          </div>
        ) : null}
      </li>
    </>
  );
};
