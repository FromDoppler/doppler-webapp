import '@testing-library/jest-dom/extend-expect';
import useCloudTags from '.';
import { renderHook } from '@testing-library/react-hooks';
import { validateEmail } from '../../validations';

const fieldName = 'tags';
const tags = ['harcode_1@mail.com', 'harcode_2@mail.com'];
const values = {
  [fieldName]: tags,
};

describe('useCloudTags hook', () => {
  describe('getAllTags function', () => {
    const useFormikContext = jest.fn(() => ({ values }));

    const {
      result: {
        current: { getAllTags },
      },
    } = renderHook(() => useCloudTags(fieldName, useFormikContext));

    it('should get all tags', async () => {
      // Act
      const allTags = getAllTags();

      // Assert
      expect(allTags).toEqual(tags);
    });
  });

  describe('validateExistenceTag function', () => {
    const useFormikContext = jest.fn(() => ({ values }));

    const {
      result: {
        current: { validateExistenceTag },
      },
    } = renderHook(() => useCloudTags(fieldName, useFormikContext));

    it('should indicate that the tag already exists with default message', () => {
      // Arrange
      const tagToAdd = 'harcode_1@mail.com';

      // Act
      const error = validateExistenceTag(tagToAdd);

      // Assert
      expect(error.props.id).toBe('cloud_tags.tag_already_exist');
      expect(error.props.values).toEqual({ tagName: tagToAdd });
    });

    it('should indicate that the tag already exists with custom message', () => {
      // Arrange
      const tagToAdd = 'harcode_1@mail.com';
      const messageKeys = { tagAlreadyExist: 'big_query.free_alt_image' };

      // Act
      const error = validateExistenceTag(tagToAdd, messageKeys);

      // Assert
      expect(error.props.id).not.toBe('cloud_tags.tag_already_exist');
      expect(error.props.id).toBe(messageKeys.tagAlreadyExist);
      expect(error.props.values).toEqual({ tagName: tagToAdd });
    });

    it('should not return an error message when the email does not exist', () => {
      // Arrange
      const tagToAdd = 'harcode_x@mail.com';

      // Act
      const error = validateExistenceTag(tagToAdd);

      // Assert
      expect(error).toBeUndefined();
    });
  });

  describe('validateMaxCountTags function', () => {
    const useFormikContext = jest.fn(() => ({ values }));

    const {
      result: {
        current: { validateMaxCountTags },
      },
    } = renderHook(() => useCloudTags(fieldName, useFormikContext));

    it('should indicate that the maximum tag limit has been reached with default message', () => {
      // Arrange
      const max = 2;

      // Act
      const error = validateMaxCountTags(max);

      // Assert
      expect(error.props.id).toBe('cloud_tags.tag_limit_exceeded');
      expect(error.props.values).toEqual({ max });
    });

    it('should indicate that the maximum tag limit has been reached with custom message', () => {
      // Arrange
      const messageKeys = { tagLimitExceeded: 'big_query.free_alt_image' };
      const max = 2;

      // Act
      const error = validateMaxCountTags(max, messageKeys);

      // Assert
      expect(error.props.id).toBe(messageKeys.tagLimitExceeded);
      expect(error.props.values).toEqual({ max });
    });

    it('should not return an error message when the maximum tag limit has not been reached', () => {
      // Arrange
      const max = 3;

      // Act
      const error = validateMaxCountTags(max);

      // Assert
      expect(error).toBeUndefined();
    });
  });

  describe('addTag function', () => {
    const errors = {};
    let push;
    let callback;
    let setErrors;
    let validate;
    let useFormikContext;

    beforeEach(() => {
      push = jest.fn();
      callback = jest.fn();
      setErrors = jest.fn();
      validate = jest.fn((tag) => validateEmail(tag));
      useFormikContext = jest.fn(() => ({
        values,
        errors,
        setErrors,
      }));
    });

    it('should add the tag when it passes the validations', () => {
      // Arrange
      const tagToAdd = 'harcode_x@mail.com';
      const push = jest.fn();
      const callback = jest.fn();
      const setErrors = jest.fn();
      const validate = jest.fn((tag) => validateEmail(tag));
      const useFormikContext = jest.fn(() => ({
        values,
        errors,
        setErrors,
      }));

      // Act
      const {
        result: {
          current: { addTag },
        },
      } = renderHook(() => useCloudTags(fieldName, useFormikContext));

      addTag({ tagToAdd, push, validate, callback });

      // Assert
      expect(validate).toHaveBeenCalledTimes(1);
      expect(validate).toHaveBeenCalledWith(tagToAdd);
      expect(validate).toHaveReturnedWith(null);

      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setErrors).toHaveBeenCalledWith({ ...errors, [fieldName]: null });

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(tagToAdd);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not add the tag when the validations fail', () => {
      // Arrange
      const tagToAdd = 'harcode_x';
      const expectedError = 'validation_messages.error_invalid_email_address';

      // Act
      const {
        result: {
          current: { addTag },
        },
      } = renderHook(() => useCloudTags(fieldName, useFormikContext));

      addTag({ tagToAdd, push, validate, callback });

      // Assert
      expect(validate).toHaveBeenCalledTimes(1);
      expect(validate).toHaveBeenCalledWith(tagToAdd);
      expect(validate).toHaveReturnedWith(expectedError);

      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setErrors).toHaveBeenCalledWith({ ...errors, [fieldName]: expectedError });

      expect(push).not.toBeCalled();

      expect(callback).not.toBeCalled();
    });
  });

  describe('validateTagToAdd function', () => {
    it('should not return errors when the value passes the validations', () => {
      // Arrange
      const tagToAdd = 'harcode_x@mail.com';
      const max = 3;
      const useFormikContext = jest.fn(() => ({}));

      // Act
      const {
        result: {
          current: { validateTagToAdd },
        },
      } = renderHook(() => useCloudTags(fieldName, useFormikContext));

      const errors = validateTagToAdd({
        tagToAdd,
        max,
        validations: [() => validateEmail(tagToAdd)],
      });

      // Assert
      expect(errors).toBeNull();
    });

    it('should return errors when the value not passes the validations', () => {
      // Arrange
      const tagToAdd = 'harcode_x';
      const max = 3;
      const useFormikContext = jest.fn(() => ({
        values,
      }));

      // Act
      const {
        result: {
          current: { validateTagToAdd },
        },
      } = renderHook(() => useCloudTags(fieldName, useFormikContext));

      const error = validateTagToAdd({
        tagToAdd,
        max,
        validations: [() => validateEmail(tagToAdd)],
      });

      // Assert
      expect(error).toBe('validation_messages.error_invalid_email_address');
    });
  });
});
