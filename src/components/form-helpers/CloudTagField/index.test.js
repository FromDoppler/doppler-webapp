import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Field, Formik, Form, FieldArray } from 'formik';
import { getAllTags, validateExistenceTag, validateMaxCountTags } from '.';
import { CloudTagField, FieldArrayControl, FieldArrayError } from '.';
import { act } from 'react-dom/test-utils';
import { validateEmail } from '../../../validations';
import { cleanup } from '@testing-library/react-hooks';

const tags = ['email1@gmail.com', 'email2@gmail.com'];

describe('validateExistenceTag', () => {
  it('should indicate that the tag already exists with default message', () => {
    // Arrange
    const repeatedTag = 'email1@gmail.com';
    const customTags = [...tags, repeatedTag];

    // Act
    const error = validateExistenceTag(customTags);

    // Assert
    expect(error.props.id).toBe('cloud_tags.tag_already_exist');
    expect(error.props.values).toEqual({ tagName: repeatedTag });
  });

  it('should indicate that the tag already exists with custom message', () => {
    // Arrange
    const repeatedTag = 'email1@gmail.com';
    const customTags = [...tags, repeatedTag];
    const messageKeys = { tagAlreadyExist: 'big_query.free_alt_image' };

    // Act
    const error = validateExistenceTag(customTags, messageKeys);

    // Assert
    expect(error.props.id).not.toBe('cloud_tags.tag_already_exist');
    expect(error.props.id).toBe(messageKeys.tagAlreadyExist);
    expect(error.props.values).toEqual({ tagName: repeatedTag });
  });

  it('should not return an error message when the email does not exist', () => {
    // Arrange
    const tagToAdd = 'emailx@gmail.com';
    const customTags = [...tags, tagToAdd];

    // Act
    const error = validateExistenceTag(customTags);

    // Assert
    expect(error).toBeUndefined();
  });
});

describe('validateMaxCountTags', () => {
  it('should indicate that the maximum tag limit has been reached with default message', () => {
    // Arrange
    const tagToAdd = 'emailx@gmail.com';
    const customTags = [...tags, tagToAdd];
    const max = 2;

    // Act
    const error = validateMaxCountTags(customTags, max);

    // Assert
    expect(error.props.id).toBe('cloud_tags.tag_limit_exceeded');
    expect(error.props.values).toEqual({ max });
  });

  it('should indicate that the maximum tag limit has been reached with custom message', () => {
    // Arrange
    const tagToAdd = 'emailx@gmail.com';
    const customTags = [...tags, tagToAdd];
    const messageKeys = { tagLimitExceeded: 'big_query.free_alt_image' };
    const max = 2;

    // Act
    const error = validateMaxCountTags(customTags, max, messageKeys);

    // Assert
    expect(error.props.id).toBe(messageKeys.tagLimitExceeded);
    expect(error.props.values).toEqual({ max });
  });

  it('should not return an error message when the maximum tag limit has not been reached', () => {
    // Arrange
    const tagToAdd = 'emailx@gmail.com';
    const customTags = [...tags, tagToAdd];
    const max = 3;

    // Act
    const error = validateMaxCountTags(customTags, max);

    // Assert
    expect(error).toBeUndefined();
  });
});

describe('getAllTags', () => {
  it('should return all non-empty tags (simulate adding a new field)', () => {
    // Arrange
    const customTags = [...tags, ''];
    const fieldName = 'emails';
    const values = {
      [fieldName]: customTags,
    };

    // Act
    const allTags = getAllTags(values, fieldName);

    // Assert
    expect(allTags).toEqual(tags);
  });
});

describe('FieldArrayControl component', () => {
  const WrapperComponent = ({ children }) => (
    <Formik initialValues={{ emails: [''] }}>
      <Form>
        <FieldArray name="emails">{children}</FieldArray>
      </Form>
    </Formik>
  );

  it('should enable add button when input is changed', async () => {
    // Arrange
    const tagName = 'emails.0';
    const componentToRender = ({ tagName, onKeyDown, validate }) => (
      <Field type="email" name={tagName} validate={validate} onKeyDown={onKeyDown} />
    );
    const props = {
      tagName,
      validate: jest.fn(),
      onKeyDown: jest.fn(),
      onClick: jest.fn(),
      disabled: true,
      render: componentToRender,
    };

    // Act
    const { container, rerender } = render(
      <WrapperComponent>
        <FieldArrayControl {...props} />
      </WrapperComponent>,
    );

    const input = container.querySelector(`input[name='${tagName}']`);
    const button = container.querySelector(`button`);

    expect(input).toBeInTheDocument();
    expect(button).toHaveAttribute('disabled');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'emailx@gmail.com' } });
    });

    rerender(
      <WrapperComponent>
        <FieldArrayControl {...{ ...props, disabled: false }} />
      </WrapperComponent>,
    );

    expect(button).not.toHaveAttribute('disabled');
  });
});

describe('FieldArrayError component', () => {
  it('should render error message when validation type is level-form ', () => {
    // Arrange
    const fieldName = 'emails';
    const errorMessage = 'required';
    const errors = {
      [fieldName]: errorMessage,
    };

    // Act
    const { getByText } = render(<FieldArrayError errors={errors} fieldName={fieldName} />);

    // Assert
    expect(getByText(`${errorMessage}`)).toBeInTheDocument();
  });

  it('should render error message when validation type is level-field ', () => {
    // Arrange
    const fieldName = 'emails';
    const errorMessage = 'tag already exist';
    const tagsErrors = [null, null, errorMessage];
    const errors = {
      [fieldName]: tagsErrors,
    };

    // Act
    const { getByText } = render(
      <FieldArrayError errors={errors} fieldName={fieldName} lastIndex={tagsErrors.length - 1} />,
    );

    // Assert
    expect(getByText(`${errorMessage}`)).toBeInTheDocument();
  });
});

describe('CloudTagField component', () => {
  const placeholderText = 'Add google account';
  const fieldName = 'emails';

  const WrapperComponent = ({ formikConfig, formConfig = {}, children }) => (
    <Formik {...formikConfig}>
      <Form {...formConfig}>
        {children}
        <button type="submit">Save</button>
      </Form>
    </Formik>
  );

  const matchTags = (cloudTags, currentTags) => {
    let tag = cloudTags.firstChild;
    let allTags = [...currentTags];
    allTags.pop(); // because the last tag is not added
    allTags.forEach((email) => {
      expect(tag).toHaveTextContent(email);
      tag = tag.nextSibling;
    });
  };

  afterEach(cleanup);

  it('should render CloudTagField with input control empty and without initial tags', () => {
    // Arrange
    const initialValues = [''];
    const formikConfig = {
      initialValues: { [fieldName]: initialValues },
    };

    // Act
    const { container, getByRole } = render(
      <WrapperComponent formikConfig={formikConfig}>
        <CloudTagField
          fieldName={fieldName}
          render={({ tagName, onKeyDown, validate }) => (
            <Field
              type="email"
              placeholder={placeholderText}
              name={tagName}
              onKeyDown={onKeyDown}
              validate={validate}
            />
          )}
        />
      </WrapperComponent>,
    );

    // Assert
    const emailField = getByRole('textbox');
    expect(emailField.value).toBe('');
    expect(emailField.name).toBe(`${fieldName}.0`);

    const button = container.querySelector('button.dp-more-tag');
    expect(button).toHaveAttribute('disabled');
    expect(container.querySelector('.dp-cloud-tags')).not.toBeInTheDocument();
  });

  it('should render CloudTagField with initial tags', () => {
    // Arrange
    const initialValues = ['emailx@gmail.com', 'emaily@gmail.com', ''];
    const formikConfig = {
      initialValues: { [fieldName]: initialValues },
    };

    // Act
    const { container, getByRole } = render(
      <WrapperComponent formikConfig={formikConfig}>
        <CloudTagField
          fieldName={fieldName}
          render={({ tagName, onKeyDown, validate }) => (
            <Field
              type="email"
              placeholder={placeholderText}
              name={tagName}
              onKeyDown={onKeyDown}
              validate={validate}
            />
          )}
        />
      </WrapperComponent>,
    );

    // Assert
    const emailField = getByRole('textbox');
    expect(emailField.value).toBe('');
    expect(emailField.name).toBe(`${fieldName}.${initialValues.length - 1}`);
    expect(container.querySelector('button.dp-more-tag')).toHaveAttribute('disabled');

    const cloudTags = container.querySelector('.dp-cloud-tags');
    expect(cloudTags).toBeInTheDocument();
    matchTags(cloudTags, initialValues);
  });

  it('should submit tags added when the user add valid tags and click submit button', async () => {
    // Arrange
    const initialValues = [''];
    const email1 = 'email_a@gmail.com';
    const email2 = 'email_b@gmail.com';
    const onSubmit = jest.fn();
    const formikConfig = {
      initialValues: { [fieldName]: initialValues },
      onSubmit,
    };

    // Act
    const { container, getByRole } = render(
      <WrapperComponent formikConfig={formikConfig}>
        <CloudTagField
          fieldName={fieldName}
          validateTag={validateEmail}
          render={({ tagName, onKeyDown, validate }) => (
            <Field
              type="email"
              placeholder={placeholderText}
              name={tagName}
              onKeyDown={onKeyDown}
              validate={validate}
            />
          )}
        />
      </WrapperComponent>,
    );

    // Arrange
    const emailField = getByRole('textbox');
    const addTagButton = container.querySelector('button.dp-more-tag');

    // add first tag (simulated with click event)
    expect(addTagButton).toHaveAttribute('disabled');
    expect(emailField.name).toBe(`${fieldName}.0`);
    await act(async () => fireEvent.change(emailField, { target: { value: email1 } }));
    expect(emailField.value).toBe(email1);
    expect(addTagButton).not.toHaveAttribute('disabled');
    await act(async () => fireEvent.click(addTagButton));

    // add second tag (simulated with enter event)
    expect(addTagButton).toHaveAttribute('disabled');
    expect(emailField.name).toBe(`${fieldName}.1`);
    await act(async () => fireEvent.change(emailField, { target: { value: email2 } }));
    expect(emailField.value).toBe(email2);
    expect(addTagButton).not.toHaveAttribute('disabled');
    await act(async () => fireEvent.keyDown(emailField, { key: 'Enter', code: 'Enter' }));

    const cloudTags = container.querySelector('.dp-cloud-tags');
    expect(cloudTags).toBeInTheDocument();
    matchTags(cloudTags, [email1, email2]);

    expect(onSubmit).toHaveBeenCalledTimes(0);
    const submitButton = container.querySelector(`button[type='submit']`);
    await act(async () => fireEvent.click(submitButton));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(onSubmit.mock.calls[0][0]).toEqual({
      [fieldName]: [email1, email2, ''],
    });
  });

  it('should shown errors message when tag to add is not an email', async () => {
    // Arrange
    const initialValues = [''];
    const emailInvalid = 'fake-text';
    const emailValid = 'emailz@gmail.com';
    const onSubmit = jest.fn();
    const formikConfig = {
      initialValues: { [fieldName]: initialValues },
      onSubmit,
    };

    // Act
    const { container, getByRole } = render(
      <WrapperComponent formikConfig={formikConfig}>
        <CloudTagField
          fieldName={fieldName}
          validateTag={validateEmail}
          render={({ tagName, onKeyDown, validate }) => (
            <Field
              type="email"
              placeholder={placeholderText}
              name={tagName}
              onKeyDown={onKeyDown}
              validate={validate}
            />
          )}
        />
      </WrapperComponent>,
    );

    // Arrange
    const emailField = getByRole('textbox');
    const addTagButton = container.querySelector('button.dp-more-tag');

    // add tag (simulated with click event)
    expect(addTagButton).toHaveAttribute('disabled');
    expect(emailField.name).toBe(`${fieldName}.0`);
    await act(async () => fireEvent.change(emailField, { target: { value: emailInvalid } }));
    expect(emailField.value).toBe(emailInvalid);
    expect(addTagButton).not.toHaveAttribute('disabled');
    await act(async () => fireEvent.click(addTagButton));

    const cloudTags = container.querySelector('.dp-cloud-tags');
    const errors = container.querySelector('.dp-error-form');

    expect(errors).toBeInTheDocument();
    expect(cloudTags).not.toBeInTheDocument();

    // add tag (simulated with enter event)
    await act(async () => fireEvent.change(emailField, { target: { value: emailValid } }));
    expect(emailField.value).toBe(emailValid);
    expect(addTagButton).not.toHaveAttribute('disabled');
    await act(async () => fireEvent.keyDown(emailField, { key: 'Enter', code: 'Enter' }));

    waitFor(() => {
      expect(errors).not.toBeInTheDocument();
      expect(cloudTags).toBeInTheDocument();
    });
  });
});
