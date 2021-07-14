import React from 'react';
import { useIntl } from 'react-intl';

/* TODO: These styles will be removed with the correct classes. Currently Gus is working with the layout. */
const containerStyle = {
  paddingLeft: '20px',
  paddingTop: '20px',
  paddingRight: '20px',
  border: '2px solid #eaeaea',
  borderRadius: '3px',
  marginTop: '20px',
};

const displaFlexAndjustifyContentSpaceBetweenStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const upperCaseStyle = {
  textTransform: 'uppercase',
};

export const Step = ({ children, title, active, complete, onActivate }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      {active ? (
        children
      ) : (
        <div className="dp-wrapper-form-plans step-header-container" style={containerStyle}>
          <div style={displaFlexAndjustifyContentSpaceBetweenStyle}>
            <h3 style={upperCaseStyle}>{title}</h3>
            {complete ? (
              <button
                className="m-b-30 edit-button"
                onClick={onActivate}
                style={{ color: '#33ad73' }}
              >
                {_('checkoutProcessForm.edit')}
              </button>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};
