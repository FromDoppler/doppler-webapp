import { FormattedMessage } from 'react-intl';
import { combineValidations } from '../../validations';

const useCloudTags = (fieldName, useFormikContext) => {
  const { values, errors, setErrors } = useFormikContext();

  const getAllTags = () => values?.[fieldName] ?? [];

  const validateExistenceTag = (tagToAdd, messageKeys) => {
    let error;
    const allTags = getAllTags();
    if (allTags.includes(tagToAdd)) {
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

  const validateMaxCountTags = (max, messageKeys) => {
    let error;
    const { length } = getAllTags();
    if (length + 1 > max) {
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

  const validateTagToAdd = ({ tagToAdd, max, validations = [], messageKeys }) => {
    let validationList = [];

    if (max) {
      validationList.push(() => validateMaxCountTags(max, messageKeys));
    }
    validationList.push(() => validateExistenceTag(tagToAdd, messageKeys));
    validationList = [...validationList, ...validations];

    const _combineValidations = combineValidations(...validationList);
    return _combineValidations(tagToAdd);
  };

  const addTag = ({ tagToAdd, push, validate, callback }) => {
    const fieldErrors = validate(tagToAdd);
    setErrors({ ...errors, [fieldName]: fieldErrors });
    if (!fieldErrors) {
      push(tagToAdd);
      if (callback) {
        callback();
      }
    }
  };

  return {
    getAllTags,
    validateMaxCountTags,
    validateExistenceTag,
    validateTagToAdd,
    addTag,
  };
};

export default useCloudTags;
