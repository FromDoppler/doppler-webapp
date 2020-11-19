import React from 'react';
import Signup from './Signup';
import { render, cleanup, waitFor, fireEvent, act } from '@testing-library/react';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider';
import DopplerIntlProviderWithIds from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter, MemoryRouter as Router, Route } from 'react-router-dom';
import { AppServicesProvider } from '../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import { timeout } from '../../utils';
import SignupConfirmation from './SignupConfirmation';

const emptyResponse = { success: false, error: new Error('Dummy error') };

const defaultDependencies = {
  dopplerSitesClient: {
    getBannerData: async () => {
      await timeout(0);
      return emptyResponse;
    },
  },
  ipinfoClient: {
    getCountryCode: async () => {
      await timeout(0);
      return 'PR';
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
  dopplerLegacyClient: {
    registerUser: () => ({ success: true }),
    resendRegistrationEmail: () => true,
  },
};

describe('Signup', () => {
  afterEach(cleanup);

  it('should not show errors on blur but after first submit', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const location = { search: 'test', pathname: '/signup' };

    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider>
          <Router>
            <Signup location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelectorAll('.error')).toHaveLength(0);

    // Act
    container.querySelector('#lastname').focus();

    // Assert
    await waitFor(() => expect(container.querySelectorAll('.error')).toHaveLength(0));

    // Act
    container.querySelector('button[type="submit"]').click();

    // Assert
    await waitFor(() => expect(container.querySelectorAll('.error')).not.toHaveLength(0));
  });

  it('should show Argentina below Argelia when selected language is ES', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const location = { search: '', pathname: '/signup' };

    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="es">
          <Router>
            <Signup location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() => {
      expect(
        container
          .querySelector('[data-country-code="dz"]')
          .nextElementSibling.getAttribute('data-country-code'),
      ).toBe('ar');
    });
  });

  it('should show Territorio Palestino, Ocupado below Territorio Britanico del Oceano Indico when selected language is ES', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const location = { search: 'test', pathname: '/signup' };

    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="es">
          <Router>
            <Signup location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() => {
      expect(
        container
          .querySelector('[data-country-code="io"]')
          .nextElementSibling.getAttribute('data-country-code'),
      ).toBe('ps');
    });
  });

  it('should show American Samoa below Algeria when selected language is EN', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const location = { search: 'test', pathname: '/signup' };

    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router>
            <Signup location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() => {
      expect(
        container
          .querySelector('[data-country-code="dz"]')
          .nextElementSibling.getAttribute('data-country-code'),
      ).toBe('as');
    });
  });

  it('should show Brunel below British Indian Ocean when selected language is EN', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const location = { search: 'test', pathname: '/signup' };

    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router>
            <Signup location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() => {
      expect(
        container
          .querySelector('[data-country-code="io"]')
          .nextElementSibling.getAttribute('data-country-code'),
      ).toBe('bn');
    });
  });

  it('should render flag based in ipinfoClient result', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const location = { search: 'test', pathname: '/signup' };

    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router>
            <Signup location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() =>
      expect(container.querySelector('.iti__selected-flag').title).toBe('Puerto Rico: +1'),
    );
  });

  it('should redirect to confirmation page when submit', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const location = { search: 'test', pathname: '/signup' };

    // Act
    const { container, getByText } = render(
      <BrowserRouter>
        <AppServicesProvider forcedServices={dependencies}>
          <DopplerIntlProviderWithIds>
            <Signup location={location} />
          </DopplerIntlProviderWithIds>
        </AppServicesProvider>
        <Route path="/signup/confirmation">
          <AppServicesProvider forcedServices={dependencies}>
            <DopplerIntlProviderWithIds>
              <SignupConfirmation location={{ status: { resend: () => null } }} />
            </DopplerIntlProviderWithIds>
          </AppServicesProvider>
        </Route>
      </BrowserRouter>,
    );

    act(() => {
      const inputName = container.querySelector('input#firstname');
      fireEvent.change(inputName, { target: { value: 'Juan' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Perez' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });

      const inputEmail = container.querySelector('input#email');
      fireEvent.change(inputEmail, { target: { value: 'hardcoded@hardcoded.com' } });

      const inputPassword = container.querySelector('input#password');
      fireEvent.change(inputPassword, { target: { value: 'HarcodedPass123' } });

      const inputPrivacyPolicies = container.querySelector('input#accept_privacy_policies');
      fireEvent.click(inputPrivacyPolicies);
    });

    act(() => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    await waitFor(() => expect(getByText('signup.thanks_for_registering')).toBeInTheDocument());
  });
});
