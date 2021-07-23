import React, { useState } from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { combineValidations } from '../../../validations';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { CloudTags } from '../../CloudTags';
import useCloudTags from '../../../hooks/useCloudTags';

// FieldArrayControl component
export const FieldArrayControl = ({ value, onChange, onKeyDown, onClick, disabled, render }) => (
  <>
    {render({ value, onChange, onKeyDown })}
    <button
      disabled={disabled}
      type="button"
      onClick={onClick}
      className="dp-button dp-more-tag"
      aria-label="add tag"
    >
      +
    </button>
  </>
);
FieldArrayControl.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  render: PropTypes.func.isRequired,
};

// FieldArrayError component
export const FieldArrayError = ({ errors, fieldName }) => {
  let errorMessage = errors?.[fieldName];

  return errorMessage ? (
    <div className="wrapper-errors dp-message dp-error-form" role="alert">
      <p>{errorMessage}</p>
    </div>
  ) : null;
};
FieldArrayError.propTypes = {
  fieldName: PropTypes.string.isRequired,
  errors: PropTypes.object,
};

// CloudTagField component
export const CloudTagField = ({ fieldName, validateTag, max, render, messageKeys }) => {
  const { addTag, validateTagToAdd } = useCloudTags(fieldName, useFormikContext);
  const { values, errors } = useFormikContext();
  const [currentValue, setCurrentValue] = useState('');

  const clearCurrentValue = () => setCurrentValue('');

  const _customValidationField = (tagToAdd) => {
    let validations = [];
    if (validateTag) {
      validations.push(() => validateTag(tagToAdd));
    }
    return validateTagToAdd({ tagToAdd, max, validations, messageKeys });
  };

  // press 'enter'
  const handleKeyDown = (event, callback) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      callback();
    }
  };

  const onChange = (e) => setCurrentValue(e.target.value);

  return (
    <FieldArray
      name={fieldName}
      render={({ push, remove }) => {
        const _addTag = () =>
          addTag({
            tagToAdd: currentValue,
            push,
            validate: _customValidationField,
            callback: clearCurrentValue,
          });
        const isEmptyTag = !currentValue;

        return (
          <>
            <ul className="field-group">
              <li
                className={classNames({
                  'field-item': true,
                  error: errors?.[fieldName],
                })}
              >
                <FieldArrayControl
                  onKeyDown={!isEmptyTag ? (e) => handleKeyDown(e, _addTag) : null}
                  disabled={isEmptyTag}
                  onClick={_addTag}
                  render={render}
                  value={currentValue}
                  onChange={onChange}
                />
                <FieldArrayError errors={errors} fieldName={fieldName} />
              </li>
            </ul>
            {values[fieldName]?.length > 0 && (
              <CloudTags tags={values[fieldName]} remove={remove} />
            )}
          </>
        );
      }}
    />
  );
};
CloudTagField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
  validateTag: PropTypes.func,
  max: PropTypes.number,
  messageKeys: PropTypes.shape({
    tagAlreadyExist: PropTypes.string,
    tag_limit_exceeded: PropTypes.string,
  }),
};
