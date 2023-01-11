import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AgenciesForm, { volumeOptions } from './AgenciesForm';
import { AppServicesProvider } from '../../services/pure-di';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('AgenciesForm component', () => {
  const dependencies = {
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
      requestAgenciesDemo: async () => {
        return { success: true };
      },
    },
    captchaUtilsService: {
      useCaptcha: () => {
        const Captcha = () => null;
        const verifyCaptcha = async () => {
          return { success: true, captchaResponseToken: 'hardcodedResponseToken' };
        };
        const recaptchaRef = null;
        return [Captcha, verifyCaptcha, recaptchaRef];
      },
    },
  };

  const AgenciesFormElement = () => (
    <AppServicesProvider forcedServices={dependencies}>
      <DopplerIntlProvider>
        <MemoryRouter initialEntries={['/AgenciesForm']}>
          <Routes>
            <Route path="/AgenciesForm" element={<AgenciesForm />} />
          </Routes>
        </MemoryRouter>
      </DopplerIntlProvider>
    </AppServicesProvider>
  );
  // jest.useFakeTimers();

  it('should show success message if submit succesfully', async () => {
    // Arrange
    const firstNameFake = 'Junior';
    const lastNameFake = 'Campos';
    const phoneFake = '+54 223 655-8877';
    const contactFake = '17:00pm - 19:00pm';

    // Act
    render(<AgenciesFormElement />);

    // Assert
    const emailField = screen.getByLabelText(/forms.label_email/i);
    const firstNameField = screen.getByLabelText(/forms.label_firstname/i);
    const lastNameField = screen.getByLabelText(/forms.label_lastname/i);
    const phoneField = screen.getByLabelText(/forms.label_phone/i);
    const contactField = screen.getByLabelText(/forms.label_contact_schedule/i);
    const option500To1000 = screen.getByLabelText(/agencies.volume_500/i);

    expect(screen.queryByText(/agencies.success_msg/i)).not.toBeInTheDocument();

    // all options are unselecteds
    volumeOptions.forEach(async (volume) => {
      expect(screen.getByLabelText(volume.description)).not.toBeChecked();
    });

    // initial value from appSessionRef
    expect(emailField).toHaveValue('hardcoded@email.com');

    // fill firstname, phone and contact fields
    await userEvent.type(firstNameField, firstNameFake);
    phoneField.focus();
    await userEvent.type(phoneField, phoneFake);
    await userEvent.type(contactField, contactFake);
    // select between 500k - 1M option
    await userEvent.click(option500To1000);

    expect(await screen.findByLabelText(/forms.label_firstname/i)).toHaveValue(firstNameFake);
    expect(await screen.findByLabelText(/forms.label_phone/i)).toHaveValue(phoneFake);
    expect(await screen.findByLabelText(/forms.label_contact_schedule/i)).toHaveValue(contactFake);
    expect(await screen.findByLabelText(/agencies.volume_500/i)).toBeChecked();

    const submitButton = await screen.findByRole('button', { name: 'agencies.submit' });
    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    // don't show success message because last name field is empty
    expect(screen.queryByText(/agencies.success_msg/i)).not.toBeInTheDocument();
    screen.getByText('validation_messages.error_required_field');

    // fill lastname
    await userEvent.type(lastNameField, lastNameFake);
    expect(await screen.findByLabelText(/forms.label_lastname/i)).toHaveValue(lastNameFake);

    await userEvent.click(submitButton);
    expect(await screen.findByText(/agencies.success_msg/i)).toBeInTheDocument();
    expect(screen.queryByText('validation_messages.error_required_field')).not.toBeInTheDocument();
  });
});
