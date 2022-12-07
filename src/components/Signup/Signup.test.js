import React from 'react';
import Signup from './Signup';
import { render, cleanup, waitFor, fireEvent, act } from '@testing-library/react';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider';
import DopplerIntlProviderWithIds from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter, MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { AppServicesProvider } from '../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import { timeout } from '../../utils';
import SignupConfirmation from './SignupConfirmation';
import { UtmCookiesManager } from '../../services/utm-cookies-manager';

const emptyResponse = { success: false, error: new Error('Dummy error') };

const defaultDependencies = {
  dopplerSitesClient: {
    getBannerData: async () => {
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
  utmCookiesManager: new UtmCookiesManager({ cookie: '' }),
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
    const location = { search: '?test', pathname: '/signup' };

    // Act
    const { container, getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProviderWithIds>
          <Router initialEntries={[location.pathname]}>
            <Routes>
              <Route path="/signup" element={<Signup location={location} />} />
              <Route
                path="/signup/confirmation"
                element={<SignupConfirmation location={{ status: { resend: () => null } }} />}
              />
            </Routes>
          </Router>
          ,
        </DopplerIntlProviderWithIds>
      </AppServicesProvider>,
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

  it('should show that the email with whitespace already exists when submit', async () => {
    // Arrange
    const utmCookies = null;
    const values = {
      firstname: 'Juan',
      lastname: 'Perez',
      phone: '+54 223 655-8877',
      email: ' hardcoded@hardcoded.com',
      password: 'HarcodedPass123',
      accept_privacy_policies: true,
    };
    const registerUser = jest.fn().mockImplementation((values, statusForm) => ({
      success: false,
      expectedError: {
        emailAlreadyExists: true,
      },
    }));
    const dependencies = {
      ...defaultDependencies,
      dopplerLegacyClient: {
        ...defaultDependencies.dopplerLegacyClient,
        registerUser,
      },
      utmCookiesManager: {
        setCookieEntry: jest.fn(),
        getUtmCookie: jest.fn().mockImplementation(() => utmCookies),
      },
    };

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

    act(() => {
      const inputName = container.querySelector('input#firstname');
      fireEvent.change(inputName, { target: { value: values.firstname } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: values.lastname } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: values.phone } });

      const inputEmail = container.querySelector('input#email');
      fireEvent.change(inputEmail, { target: { value: values.email } });

      const inputPassword = container.querySelector('input#password');
      fireEvent.change(inputPassword, { target: { value: values.password } });

      const inputPrivacyPolicies = container.querySelector('input#accept_privacy_policies');
      fireEvent.click(inputPrivacyPolicies);
    });

    act(() => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    await waitFor(() => expect(registerUser).toHaveBeenCalledTimes(1));
    expect(registerUser).toHaveBeenCalledWith({
      ...values,
      email: values['email'].trim(),
      accept_promotions: '',
      firstOrigin: undefined,
      captchaResponseToken: 'hardcodedResponseToken',
      language: 'en',
      origin: null,
      page: null,
      redirect: '',
      utm_source: 'direct',
      utm_campaign: null,
      utm_cookies: utmCookies,
      utm_medium: null,
      utm_term: null,
      gclid: null,
      utm_content: null,
      origin_inbound: null,
    });
  });

  it('should show that utm_content param is included in request', async () => {
    // Arrange
    const values = {
      firstname: 'Juan',
      lastname: 'Perez',
      phone: '+54 223 655-8877',
      email: ' hardcoded@hardcoded.com',
      password: 'HarcodedPass123',
      accept_privacy_policies: true,
    };
    const registerUser = jest.fn().mockImplementation((values, statusForm) => ({
      success: false,
      expectedError: {
        emailAlreadyExists: true,
      },
    }));
    const utmCookies = [{ UTMContent: 'test-utm-content', Origin_Inbound: 'recursos-covid' }];
    const dependencies = {
      ...defaultDependencies,
      dopplerLegacyClient: {
        ...defaultDependencies.dopplerLegacyClient,
        registerUser,
      },
      utmCookiesManager: {
        setCookieEntry: jest.fn(),
        getUtmCookie: jest.fn().mockImplementation(() => utmCookies),
      },
    };

    const search = '?utm_content=test-utm-content&origin_inbound=recursos-covid';
    const location = { search, pathname: `/signup/${search}` };

    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router initialEntries={[location.search]}>
            <Signup location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    act(() => {
      const inputName = container.querySelector('input#firstname');
      fireEvent.change(inputName, { target: { value: values.firstname } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: values.lastname } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: values.phone } });

      const inputEmail = container.querySelector('input#email');
      fireEvent.change(inputEmail, { target: { value: values.email } });

      const inputPassword = container.querySelector('input#password');
      fireEvent.change(inputPassword, { target: { value: values.password } });

      const inputPrivacyPolicies = container.querySelector('input#accept_privacy_policies');
      fireEvent.click(inputPrivacyPolicies);
    });

    act(() => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    await waitFor(() => expect(registerUser).toHaveBeenCalledTimes(1));
    expect(registerUser).toHaveBeenCalledWith({
      ...values,
      email: values['email'].trim(),
      accept_promotions: '',
      firstOrigin: undefined,
      captchaResponseToken: 'hardcodedResponseToken',
      language: 'en',
      origin: null,
      page: null,
      redirect: '',
      utm_source: undefined,
      utm_campaign: undefined,
      utm_cookies: utmCookies,
      utm_medium: undefined,
      utm_term: undefined,
      gclid: undefined,
      utm_content: 'test-utm-content',
      origin_inbound: 'recursos-covid',
    });
  });

  it("should use UTM's last click from utm_cookies when the user accepts cookies", async () => {
    // Arrange
    const values = {
      firstname: 'Juan',
      lastname: 'Perez',
      phone: '+54 223 655-8877',
      email: ' hardcoded@hardcoded.com',
      password: 'HarcodedPass123',
      accept_privacy_policies: true,
    };
    const registerUser = jest.fn().mockImplementation(() => ({
      success: false,
      expectedError: {
        emailAlreadyExists: true,
      },
    }));
    const utmCookies = [
      {
        Date: '9/12/2022 8:31:27 PM +00:00',
        UTMSource: 'direct',
        UTMMedium: null,
        UTMCampaign: null,
        UTMTerm: null,
        UTMContent: null,
      },
      {
        Date: '9/12/2022 8:33:53 PM +00:00',
        UTMSource: 'fromdoppler',
        UTMMedium: 'email',
        UTMCampaign: 'inbound-demodayseptiembre2022',
        UTMTerm: null,
        UTMContent: null,
      },
    ];
    const dependencies = {
      ...defaultDependencies,
      dopplerLegacyClient: {
        ...defaultDependencies.dopplerLegacyClient,
        registerUser,
      },
      utmCookiesManager: {
        setCookieEntry: jest.fn(),
        getUtmCookie: jest.fn().mockImplementation(() => utmCookies),
      },
    };

    const search =
      '?utm_source=fromdoppler&utm_medium=email&utm_campaign=inbound-demodayseptiembre2022';
    const location = { search, pathname: `/signup/${search}` };

    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router initialEntries={[location.search]}>
            <Signup location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
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
    await waitFor(() => expect(registerUser).toHaveBeenCalledTimes(1));
    expect(registerUser).toHaveBeenCalledWith({
      ...values,
      email: values['email'].trim(),
      accept_promotions: '',
      firstOrigin: undefined,
      captchaResponseToken: 'hardcodedResponseToken',
      language: 'en',
      origin: null,
      page: null,
      redirect: '',
      utm_source: utmCookies[utmCookies.length - 1].UTMSource,
      utm_campaign: utmCookies[utmCookies.length - 1].UTMCampaign,
      utm_cookies: utmCookies,
      utm_medium: utmCookies[utmCookies.length - 1].UTMMedium,
      utm_term: null,
      gclid: undefined,
      utm_content: null,
      origin_inbound: undefined,
    });
  });

  it("should use UTM's last click from URL", async () => {
    // Arrange
    const values = {
      firstname: 'Juan',
      lastname: 'Perez',
      phone: '+54 223 655-8877',
      email: ' hardcoded@hardcoded.com',
      password: 'HarcodedPass123',
      accept_privacy_policies: true,
    };
    const registerUser = jest.fn().mockImplementation(() => ({
      success: false,
      expectedError: {
        emailAlreadyExists: true,
      },
    }));
    const utmCookies = null;
    const dependencies = {
      ...defaultDependencies,
      dopplerLegacyClient: {
        ...defaultDependencies.dopplerLegacyClient,
        registerUser,
      },
      utmCookiesManager: {
        setCookieEntry: jest.fn(),
        getUtmCookie: jest.fn().mockImplementation(() => utmCookies),
      },
    };

    const search = '';
    const location = { search, pathname: `/signup/${search}` };

    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router initialEntries={[location.search]}>
            <Signup location={location} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
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
    await waitFor(() => expect(registerUser).toHaveBeenCalledTimes(1));
    expect(registerUser).toHaveBeenCalledWith({
      ...values,
      email: values['email'].trim(),
      accept_promotions: '',
      firstOrigin: undefined,
      captchaResponseToken: 'hardcodedResponseToken',
      language: 'en',
      origin: null,
      page: null,
      redirect: '',
      utm_source: 'direct',
      utm_campaign: null,
      utm_cookies: utmCookies,
      utm_medium: null,
      utm_term: null,
      gclid: null,
      utm_content: null,
      origin_inbound: null,
    });
  });
});
