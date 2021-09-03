import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UpgradeSuggestionForm from './UpgradeSuggestionForm';
import { AppServicesProvider } from '../../services/pure-di';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

describe('UpgradeSuggestionForm component', () => {
  const captchaResponseToken = 'hardcodedResponseToken';
  const dependencies = (mock) => ({
    appSessionRef: {
      current: {
        userData: {
          user: {
            email: 'hardcoded@email.com',
          },
        },
      },
    },
    dopplerLegacyClient: {
      requestSuggestionUpgradeForm: mock,
    },
    captchaUtilsService: {
      useCaptcha: () => {
        const Captcha = () => null;
        const verifyCaptcha = async () => {
          return { success: true, captchaResponseToken };
        };
        const recaptchaRef = null;
        return [Captcha, verifyCaptcha, recaptchaRef];
      },
    },
  });

  const UpgradeSuggestionFormElement = ({ mock }) => (
    <AppServicesProvider forcedServices={dependencies(mock)}>
      <DopplerIntlProvider>
        <UpgradeSuggestionForm />
      </DopplerIntlProvider>
    </AppServicesProvider>
  );

  it('should show success message if submit succesfully', async () => {
    // Arrange
    const email = 'hardcoded@email.com';
    const firstname = 'Juan';
    const lastname = 'Perez';
    const phone = '+54 223 655-8877';
    const mock = jest.fn().mockResolvedValue({ success: true });

    // Act
    render(<UpgradeSuggestionFormElement mock={mock} />);

    // Assert
    const inputEmail = await screen.findByRole('textbox', { name: 'signup.label_email' });
    expect(inputEmail).toHaveValue(email);

    let inputName = screen.getByRole('textbox', { name: 'signup.label_firstname' });
    userEvent.type(inputName, firstname);
    inputName = await screen.findByRole('textbox', { name: 'signup.label_firstname' });
    expect(inputName).toHaveValue(firstname);

    let inputLastname = screen.getByRole('textbox', { name: 'signup.label_lastname' });
    userEvent.type(inputLastname, lastname);
    inputLastname = await screen.findByRole('textbox', { name: 'signup.label_lastname' });
    expect(inputLastname).toHaveValue(lastname);

    let inputPhone = screen.getByRole('textbox', { name: 'signup.label_phone' });
    userEvent.paste(inputPhone, phone);
    inputPhone = await screen.findByRole('textbox', { name: 'signup.label_phone' });
    expect(inputPhone).toHaveValue(phone);

    expect(screen.queryByText('upgrade_suggestion_form.success')).not.toBeInTheDocument();
    const submitButton = await screen.getByRole('button', {
      name: 'upgrade_suggestion_form.submit_button',
    });

    userEvent.click(submitButton);
    await act(async () => expect(submitButton).toBeDisabled());

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith({
      captchaResponseToken,
      email,
      firstname,
      lastname,
      message: '',
      phone,
      range_time: '',
    });
    expect(screen.queryByText('upgrade_suggestion_form.success')).toBeInTheDocument();
  });

  it('should show messages for empty required fields', async () => {
    // Arrange
    const emptyValue = '';
    const mock = jest.fn().mockResolvedValue({ success: true });

    render(<UpgradeSuggestionFormElement mock={mock} />);

    // Assert
    let inputName = screen.getByRole('textbox', { name: 'signup.label_firstname' });
    userEvent.clear(inputName);
    inputName = await screen.findByRole('textbox', { name: 'signup.label_firstname' });
    expect(inputName).toHaveValue(emptyValue);

    let inputLastname = screen.getByRole('textbox', { name: 'signup.label_lastname' });
    userEvent.clear(inputLastname);
    inputLastname = await screen.findByRole('textbox', { name: 'signup.label_lastname' });
    expect(inputLastname).toHaveValue(emptyValue);

    let inputPhone = screen.getByRole('textbox', { name: 'signup.label_phone' });
    userEvent.clear(inputPhone);
    inputPhone = await screen.findByRole('textbox', { name: 'signup.label_phone' });
    expect(inputPhone).toHaveValue(emptyValue);

    const submitButton = await screen.getByRole('button', {
      name: 'upgrade_suggestion_form.submit_button',
    });
    userEvent.click(submitButton);
    await act(async () => expect(submitButton).toBeDisabled());

    expect(screen.getAllByText('validation_messages.error_required_field').length).toBe(3);
    expect(screen.queryByText('upgrade_suggestion_form.success')).not.toBeInTheDocument();
  });
});
