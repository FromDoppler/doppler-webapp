import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { ScrollToFieldError } from '.';
import { Formik, Form } from 'formik';
import {
  EmailFieldItem,
  FieldGroup,
  InputFieldItem,
  SubmitButton,
} from '../../form-helpers/form-helpers';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

const fieldNames = {
  firstname: 'firstname',
  lastname: 'lastname',
  email: 'email',
};

const FormikWrapper = ({ children, onSubmit }) => (
  <IntlProvider>
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        [fieldNames.firstname]: '',
        [fieldNames.lastname]: 'Campos',
        [fieldNames.email]: 'invalid-email',
      }}
    >
      <Form>
        {children}
        <FieldGroup>
          <InputFieldItem
            className="field-item--50"
            fieldName={fieldNames.firstname}
            label={'signup.label_firstname'}
            type="text"
            minLength="2"
            required
            withNameValidation
          />
          <InputFieldItem
            className="field-item--50"
            fieldName={fieldNames.lastname}
            label={'signup.label_lastname'}
            type="text"
            minLength="2"
            required
            withNameValidation
          />
          <EmailFieldItem
            fieldName={fieldNames.email}
            label={'signup.label_email'}
            placeholder={'signup.placeholder_email'}
            required
          />
        </FieldGroup>
        <SubmitButton className="button--round">{'signup.button_signup'}</SubmitButton>
      </Form>
    </Formik>
  </IntlProvider>
);

const spyScroll = jest.fn();

describe('ScrollToFieldError', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scroll', { value: spyScroll });
    Object.defineProperty(window, 'scrollY', { value: 1 });
    spyScroll.mockClear();
  });

  it('should to do autoFocus in the first field with error when the form is submitted', async () => {
    // Arrange
    jest.useFakeTimers('legacy');
    const behavior = {
      left: 0,
      behavior: 'smooth',
    };
    let customUseFormikContext = jest.fn(() => ({
      submitCount: 1,
      isValid: false,
      errors: {
        [fieldNames.firstname]: 'validation_messages.error_required_field',
        [fieldNames.email]: 'validation_messages.error_required_field',
      },
    }));
    const onSubmit = jest.fn();

    // Act
    const { rerender } = render(
      <FormikWrapper onSubmit={onSubmit}>
        <ScrollToFieldError
          useFormikContext={customUseFormikContext}
          fieldsOrder={Object.values(fieldNames)}
        />
      </FormikWrapper>,
    );

    // Assert
    const getFirstNameField = () =>
      screen.getByRole('textbox', {
        name: 'signup.label_firstname',
      });

    const getEmailField = () =>
      screen.getByRole('textbox', {
        name: 'signup.label_email',
      });

    // the first time, first name field has not auto focus
    expect(getFirstNameField()).not.toHaveFocus();

    // click to submit buton
    userEvent.click(screen.getByRole('button', { type: 'submit' }));

    // simulate scroll with smooth behavior
    jest.runAllTimers();

    expect(spyScroll).toHaveBeenCalledTimes(1);
    expect(spyScroll).toBeCalledWith(expect.objectContaining(behavior));

    // the first field with error it is first name. It should have auto focus
    expect(getFirstNameField()).toHaveFocus();

    // fill in first name with a valid name
    jest.useRealTimers();
    await act(() => userEvent.type(getFirstNameField(), 'Junior'));

    // click to submit buton
    jest.useFakeTimers('legacy');
    userEvent.click(screen.getByRole('button', { type: 'submit' }));

    // rerender with only one error because first name was filled
    customUseFormikContext = jest.fn(() => ({
      submitCount: 2,
      isValid: false,
      errors: {
        [fieldNames.email]: 'validation_messages.error_required_field',
      },
    }));
    await act(() =>
      rerender(
        <FormikWrapper onSubmit={onSubmit}>
          <ScrollToFieldError
            useFormikContext={customUseFormikContext}
            fieldsOrder={Object.values(fieldNames)}
          />
        </FormikWrapper>,
      ),
    );

    // simulate scroll with smooth behavior
    jest.runAllTimers();

    expect(spyScroll).toHaveBeenCalledTimes(2);
    expect(spyScroll).toBeCalledWith(expect.objectContaining(behavior));
    // the first field with error it is email. It should have auto focus
    expect(getEmailField()).toHaveFocus();
  });
});
