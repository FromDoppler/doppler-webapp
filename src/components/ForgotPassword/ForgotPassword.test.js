import React from 'react';
import ForgotPassword from './ForgotPassword';
import { render, cleanup, waitFor, fireEvent, act } from '@testing-library/react';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider';
import { MemoryRouter as Router } from 'react-router-dom';
import { AppServicesProvider } from '../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import { timeout } from '../../utils';

const emptyResponse = { success: false, error: new Error('Dummy error') };

const defaultDependencies = {
  dopplerLegacyClient: {
    sendResetPasswordEmail: () => ({ success: true }),
  },
  dopplerSitesClient: {
    getBannerData: async () => {
      return emptyResponse;
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

describe('ForgotPassword', () => {
  afterEach(cleanup);

  it('should not send the email when email is empty when submit', async () => {
    // Arrange
    const promise = Promise.resolve();
    const sendResetPasswordEmail = jest.fn(() => promise);
    const dependencies = {
      ...defaultDependencies,
      dopplerLegacyClient: {
        ...defaultDependencies.dopplerLegacyClient,
        sendResetPasswordEmail,
      },
    };
    const location = { search: 'test', pathname: '/reset-password' };

    // Act
    const { container, getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router>
            <ForgotPassword location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    act(() => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    await act(() => promise);

    // Assert
    await waitFor(() => expect(getByText('Ouch! The field is empty.')).toBeInTheDocument());
  });

  it('should send the email without whitespace when submit', async () => {
    // Arrange
    const promise = Promise.resolve({ success: true });
    const sendResetPasswordEmail = jest.fn(() => promise);
    const dependencies = {
      ...defaultDependencies,
      dopplerLegacyClient: {
        ...defaultDependencies.dopplerLegacyClient,
        sendResetPasswordEmail,
      },
    };
    const location = { search: 'test', pathname: '/reset-password' };
    const email = ' hardcoded@hardcoded.com';

    // Act
    const { container, getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router>
            <ForgotPassword location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    act(() => {
      const inputEmail = container.querySelector('input#email');
      fireEvent.change(inputEmail, { target: { value: email } });
    });

    act(() => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    await act(() => promise);

    // Assert
    await waitFor(() => expect(sendResetPasswordEmail).toHaveBeenCalledTimes(1));
    expect(sendResetPasswordEmail).toHaveBeenCalledWith({
      captchaResponseToken: 'hardcodedResponseToken',
      email: email.trim(),
    });
    expect(getByText(/Check your inbox!/)).toBeInTheDocument();
  });
});
