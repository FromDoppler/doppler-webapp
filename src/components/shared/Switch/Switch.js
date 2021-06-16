import React from 'react';
import PropTypes from 'prop-types';

export const Switch = ({ defaultChecked, disabled, id, name, onChange, text }) => {
  return (
    <>
      <div className="dp-switch">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          disabled={disabled}
          id={id}
          name={name}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={id}>
          <span />
        </label>
      </div>
      <label htmlFor="switch">{text}</label>
    </>
  );
};

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  text: PropTypes.string,
};
