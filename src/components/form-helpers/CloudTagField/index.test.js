import { fireEvent, render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Formik, Form, FieldArray } from 'formik';
import { CloudTagField, FieldArrayControl, FieldArrayError } from '.';
import { validateEmail } from '../../../validations';

const fieldName = 'emails';

describe('FieldArrayControl component', () => {
  const WrapperComponent = ({ children }) => (
    <Formik initialValues={{ emails: [] }}>
      <Form>
        <FieldArray name="emails">{children}</FieldArray>
      </Form>
    </Formik>
  );

  it('should enable add button when input is changed', async () => {
    // Arrange
    const currentValue = '';
    const componentToRender = ({ value, onChange, onKeyDown }) => (
      <input type="email" value={value} onChange={onChange} onKeyDown={onKeyDown} />
    );
    const props = {
      value: currentValue,
      onChange: jest.fn(),
      onKeyDown: jest.fn(),
      onClick: jest.fn(),
      disabled: true,
      render: componentToRender,
    };

    // Act
    const { rerender } = render(
      <WrapperComponent>
        <FieldArrayControl {...props} />
      </WrapperComponent>,
    );

    const input = screen.getByRole(`textbox`);
    const button = screen.getByRole(`button`, { name: 'add tag' });

    expect(input).toBeInTheDocument();
    expect(button).toHaveAttribute('disabled');

    fireEvent.change(input, { target: { value: 'emailx@gmail.com' } });

    rerender(
      <WrapperComponent>
        <FieldArrayControl {...{ ...props, disabled: false }} />
      </WrapperComponent>,
    );

    expect(button).not.toHaveAttribute('disabled');
  });
});

describe('FieldArrayError component', () => {
  it('should render error message when it has errors', () => {
    // Arrange
    const errorMessage = 'required';
    const errors = {
      [fieldName]: errorMessage,
    };

    // Act
    render(<FieldArrayError errors={errors} fieldName={fieldName} />);

    // Assert
    expect(screen.getByText(`${errorMessage}`)).toBeInTheDocument();
  });
});

describe('CloudTagField component', () => {
  const placeholderText = 'Add google account';

  const WrapperComponent = ({ formikConfig, validateTag, formConfig = {} }) => (
    <Formik {...formikConfig}>
      <Form {...formConfig}>
        <CloudTagField
          fieldName={fieldName}
          validateTag={validateTag}
          render={({ value, onChange, onKeyDown }) => (
            <input
              type="email"
              placeholder={placeholderText}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          )}
        />
        <button type="submit">Save</button>
      </Form>
    </Formik>
  );

  const matchTags = (cloudTags, currentTags) => {
    let tag = cloudTags.firstChild;
    let allTags = [...currentTags];
    allTags.forEach((email) => {
      expect(tag).toHaveTextContent(email);
      tag = tag.nextSibling;
    });
  };

  it('should render CloudTagField with input control empty and without initial tags', () => {
    // Arrange
    const initialValues = [];
    const formikConfig = {
      initialValues: { [fieldName]: initialValues },
    };

    // Act
    render(<WrapperComponent formikConfig={formikConfig} />);

    // Assert
    const emailField = screen.getByRole('textbox');
    expect(emailField.value).toBe('');

    const button = screen.getByRole(`button`, { name: 'add tag' });
    expect(button).toHaveAttribute('disabled');
    expect(screen.queryByRole('list', { name: 'cloud tags' })).not.toBeInTheDocument();
  });

  it('should render CloudTagField with initial tags', () => {
    // Arrange
    const initialValues = ['emailx@gmail.com', 'emaily@gmail.com'];
    const formikConfig = {
      initialValues: { [fieldName]: initialValues },
    };

    // Act
    render(<WrapperComponent formikConfig={formikConfig} />);

    // Assert
    const emailField = screen.getByRole('textbox');
    expect(emailField.value).toBe('');
    expect(screen.getByRole('button', { name: 'add tag' })).toHaveAttribute('disabled');

    const cloudTags = screen.getByRole('list', { name: 'cloud tags' });
    expect(cloudTags).toBeInTheDocument();
    matchTags(cloudTags, initialValues);
  });

  it('should submit tags added when the user add valid tags and click submit button', async () => {
    // Arrange
    const initialValues = [];
    const email1 = 'email_a@gmail.com';
    const email2 = 'email_b@gmail.com';
    const onSubmit = jest.fn();
    const formikConfig = {
      initialValues: { [fieldName]: initialValues },
      onSubmit,
    };

    // Act
    render(<WrapperComponent formikConfig={formikConfig} validateTag={validateEmail} />);

    // Arrange
    const emailField = screen.getByRole('textbox');
    const addTagButton = screen.getByRole('button', { name: 'add tag' });

    // add first tag (simulated with click event)
    expect(addTagButton).toHaveAttribute('disabled');
    await fireEvent.change(emailField, { target: { value: email1 } });
    expect(emailField.value).toBe(email1);
    expect(addTagButton).not.toHaveAttribute('disabled');
    await act(() => fireEvent.click(addTagButton));

    // add second tag (simulated with enter event)
    expect(addTagButton).toHaveAttribute('disabled');
    await fireEvent.change(emailField, { target: { value: email2 } });
    expect(emailField.value).toBe(email2);
    expect(addTagButton).not.toHaveAttribute('disabled');
    await fireEvent.keyDown(emailField, { key: 'Enter', code: 'Enter' });

    const cloudTags = screen.getByRole('list', { name: 'cloud tags' });
    expect(cloudTags).toBeInTheDocument();
    matchTags(cloudTags, [email1, email2]);

    expect(onSubmit).toHaveBeenCalledTimes(0);
    const submitButton = screen.getByRole('button', { name: /Save/i });
    await act(async () => fireEvent.click(submitButton));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(onSubmit.mock.calls[0][0]).toEqual({
      [fieldName]: [email1, email2],
    });
  });

  it('should shown errors message when tag to add is not an email', async () => {
    // Arrange
    const initialValues = [];
    const emailInvalid = 'fake-text';
    const emailValid = 'emailz@gmail.com';
    const onSubmit = jest.fn();
    const formikConfig = {
      initialValues: { [fieldName]: initialValues },
      onSubmit,
    };

    // Act
    render(<WrapperComponent formikConfig={formikConfig} validateTag={validateEmail} />);

    // Arrange
    const emailField = screen.getByRole('textbox');
    const addTagButton = screen.getByRole('button', { name: 'add tag' });

    // add tag (simulated with click event)
    expect(addTagButton).toHaveAttribute('disabled');
    await fireEvent.change(emailField, { target: { value: emailInvalid } });
    expect(emailField.value).toBe(emailInvalid);
    expect(addTagButton).not.toHaveAttribute('disabled');
    await act(() => fireEvent.click(addTagButton));

    const cloudTags = screen.queryByRole('list', { name: 'cloud tags' });
    const errors = screen.queryByRole('alert');

    expect(errors).toBeInTheDocument();
    expect(cloudTags).not.toBeInTheDocument();

    // add tag (simulated with enter event)
    await fireEvent.change(emailField, { target: { value: emailValid } });
    expect(emailField.value).toBe(emailValid);
    expect(addTagButton).not.toHaveAttribute('disabled');

    await act(() => fireEvent.keyDown(emailField, { key: 'Enter', code: 'Enter' }));

    expect(errors).not.toBeInTheDocument();
    expect(await screen.findByRole('list', { name: 'cloud tags' })).toBeInTheDocument();
  });
});
