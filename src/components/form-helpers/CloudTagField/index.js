import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { combineValidations } from '../../../validations';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { CloudTags } from '../../CloudTags';

export const validateExistenceTag = (allTags, messageKeys) => {
  let error;
  let tags = [...allTags];
  const tagToAdd = tags.pop();
  if (tags.includes(tagToAdd)) {
    const id = messageKeys?.tagAlreadyExist ?? 'cloud_tags.tag_already_exist';
    error = (
      <FormattedMessage
        id={id}
        values={{
          tagName: tagToAdd,
        }}
      />
    );
  }
  return error;
};

export const validateMaxCountTags = (allTags, max, messageKeys) => {
  let error;
  const { length } = allTags;
  if (length > max) {
    const id = messageKeys?.tagLimitExceeded ?? 'cloud_tags.tag_limit_exceeded';
    error = (
      <FormattedMessage
        id={id}
        values={{
          max,
        }}
      />
    );
  }
  return error;
};

export const getAllTags = (values, fieldName) => {
  let tags = [];
  if (values?.[fieldName]) {
    tags = [...values?.[fieldName]].filter((tag) => tag);
  }
  return tags;
};

// FieldArrayControl component
export const FieldArrayControl = ({ tagName, validate, onKeyDown, onClick, disabled, render }) => (
  <>
    {render({ tagName, onKeyDown, validate })}
    <button disabled={disabled} type="button" onClick={onClick} className="dp-button dp-more-tag">
      +
    </button>
  </>
);
FieldArrayControl.propTypes = {
  tagName: PropTypes.string.isRequired,
  validate: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  render: PropTypes.func.isRequired,
};

// FieldArrayError component
export const FieldArrayError = ({ errors, fieldName, lastIndex }) => {
  let errorMessage = errors?.[fieldName];
  const isFormValidationError = errorMessage && typeof errorMessage === 'string';

  if (!isFormValidationError) {
    errorMessage = errors?.[fieldName]?.[lastIndex];
  }

  return errorMessage ? (
    <div className="wrapper-errors dp-message dp-error-form">
      <p>{errorMessage}</p>
    </div>
  ) : null;
};
FieldArrayError.propTypes = {
  fieldName: PropTypes.string.isRequired,
  lastIndex: PropTypes.number,
  errors: PropTypes.object,
};

// CloudTagField component
export const CloudTagField = ({ fieldName, validateTag, max, render, messageKeys }) => {
  const { values, errors, validateField } = useFormikContext();

  // press 'enter'
  const handleKeyDown = (event, callback) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      callback();
    }
  };

  const addTag = async (validateField, tagName, callback) => {
    const errors = await validateField(tagName);
    if (!errors && callback) {
      callback();
    }
  };

  const _combineValidations = (fieldValue) => {
    const allTags = getAllTags(values, fieldName);
    let validations = [];
    if (validateTag) {
      validations.push(() => validateTag(fieldValue));
    }
    if (max) {
      validations.push(() => validateMaxCountTags(allTags, max, messageKeys));
    }
    validations.push(() => validateExistenceTag(allTags, messageKeys));
    return () => combineValidations(...validations);
  };

  return (
    <FieldArray
      name={fieldName}
      render={({ push, remove }) => {
        const lastIndex = Math.max(0, values[fieldName].length - 1);
        const tagName = `${fieldName}.${lastIndex}`;
        const _addTag = () => addTag(validateField, tagName, () => push(''));
        const lastFieldValue = values[fieldName][lastIndex];
        const isEmptyTag = !lastFieldValue;
        const customsValidationField = _combineValidations(lastFieldValue);

        return (
          <>
            <ul className="field-group">
              <li
                className={classNames({
                  'field-item': true,
                  error: errors?.[fieldName]?.[lastIndex],
                })}
              >
                <FieldArrayControl
                  tagName={tagName}
                  validate={!isEmptyTag ? customsValidationField() : null}
                  onKeyDown={!isEmptyTag ? (e) => handleKeyDown(e, _addTag) : null}
                  disabled={isEmptyTag}
                  onClick={_addTag}
                  render={render}
                />
                <FieldArrayError errors={errors} fieldName={fieldName} lastIndex={lastIndex} />
              </li>
            </ul>
            {values[fieldName]?.length > 1 && (
              <CloudTags tags={values[fieldName].slice(0, lastIndex)} remove={remove} />
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
