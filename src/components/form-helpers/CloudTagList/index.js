import { FieldArray, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import { CloudTags } from '../../CloudTags';
import useCloudTags from '../../../hooks/useCloudTags';

const mapTags = (tags, labelKey) => tags.map((tag) => tag[labelKey]);

// CloudTagField component
export const CloudTagList = ({ fieldName, labelKey, max, disabled, messageKeys, render }) => {
  const { getAllTags, validateTagToAdd, addTag } = useCloudTags(
    fieldName,
    useFormikContext,
    labelKey,
  );

  const _customValidationField = (tagToAdd) => validateTagToAdd({ tagToAdd, max, messageKeys });

  const tags = labelKey ? mapTags(getAllTags(), labelKey) : getAllTags();

  return (
    <FieldArray
      name={fieldName}
      render={({ push, remove }) => {
        const _addTag = (tagToAdd) => addTag({ tagToAdd, push, validate: _customValidationField });

        return (
          <CloudTags
            tags={tags}
            remove={remove}
            disabled={disabled}
            render={() => render(_addTag)}
          />
        );
      }}
    />
  );
};
CloudTagList.propTypes = {
  fieldName: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  max: PropTypes.number,
  disabled: PropTypes.bool,
  messageKeys: PropTypes.shape({
    tagAlreadyExist: PropTypes.string,
    tag_limit_exceeded: PropTypes.string,
  }),
};
