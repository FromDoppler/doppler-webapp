import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import { AppServicesProvider } from './services/pure-di';
import { MemoryRouter as Router, withRouter } from 'react-router-dom';
import { timeout } from './utils';
import { act } from 'react-dom/test-utils';

function createDoubleSessionManager(appSessionRef) {
  const double = {
    initialize: (handler) => {
      double.updateAppSession = (session) => {
        if (appSessionRef) {
          appSessionRef.current = session;
        }
        handler(session);
      };
    },
    finalize: () => {},
    session: {
      status: 'unknown',
    },
  };
  return double;
}

function createLocalStorageDouble() {
  const items = {};
  const double = {
    setItem: (key, value) => {
      items[key] = value;
    },
    getItem: (key) => items[key],
    removeItem: (key) => {
      delete items[key];
    },
    clear: () => {
      items = {};
    },
    getAllItems: () => ({ ...items }),
  };
  return double;
}

const RouterInspector = withRouter(({ match, location, history, target }) => {
  target.match = match;
  target.location = location;
  target.history = history;
  return null;
});

const emptyResponse = { success: false, error: new Error('Dummy error') };

const rejectedPromise = Promise.resolve({ success: false, value: '' });
const dopplerSitesClientDouble = {
  getBannerData: jest.fn(async () => rejectedPromise),
};

const createJsonParse = (item) => {
  JSON.parse = jest.fn().mockImplementationOnce(() => {
    if (item) {
      const array = [];
      array.push(item);
      return array;
    }
    return [];
  });
};

const defaultDependencies = {
  sessionManager: createDoubleSessionManager(),
  dopplerSitesClient: dopplerSitesClientDouble,
};

describe('App component', () => {
  afterEach(cleanup);

  describe('language', () => {
    it('should make honor to locale="en"', async () => {
      // Arrange
      const dependencies = defaultDependencies;

      // Act
      const { getByText } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(getByText('Privacy Policy & Legals')));
      await act(() => rejectedPromise);
    });

    it('should make honor to locale="es"', async () => {
      // Arrange
      const dependencies = defaultDependencies;
      // Act
      const { getByText } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login']}>
            <App locale="es" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(getByText('Política de Privacidad y Legales')));
    });

    it('should use Spanish when language is not supported', async () => {
      // Arrange
      const dependencies = defaultDependencies;

      // Act
      const { getByText } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login']}>
            <App locale="fr" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(getByText('Política de Privacidad y Legales')));
    });

    it('should use Spanish when language is not defined', async () => {
      // Arrange
      const dependencies = defaultDependencies;

      // Act
      const { getByText } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login']}>
            <App />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(getByText('Política de Privacidad y Legales')));
    });

    it("should be updated based on user's data", async () => {
      // Arrange
      const appSessionRef = { current: { status: 'unknown' } };
      const dependencies = {
        appSessionRef: appSessionRef,
        sessionManager: createDoubleSessionManager(appSessionRef),
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      const { getByText, container } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/reports']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // I cannot verify the language when the state is loading,
      // assuming English.
      const loadingEl = container.querySelector('.loading-page');
      expect(loadingEl).not.toBeNull();
      await waitFor(() => {});
      // Act
      act(() => {
        dependencies.sessionManager.updateAppSession({
          status: 'authenticated',
          userData: {
            user: {
              lang: 'es',
              avatar: {},
              plan: {},
              sms: {},
              nav: [],
            },
            nav: [],
            features: {
              siteTrackingEnabled: false,
              siteTrackingActive: false,
              emailParameterEnabled: false,
              emailParameterActive: false,
            },
          },
        });
      });

      // Assert
      await waitFor(() => getByText('Política de Privacidad y Legales'));

      // Act
      act(() => {
        dependencies.sessionManager.updateAppSession({
          status: 'authenticated',
          userData: {
            user: {
              lang: 'en',
              avatar: {},
              plan: {},
              sms: {},
              nav: [],
            },
            nav: [],
            features: {
              siteTrackingEnabled: false,
              siteTrackingActive: false,
              emailParameterEnabled: false,
              emailParameterActive: false,
            },
          },
        });
      });

      // Assert
      await waitFor(() => getByText('Privacy Policy & Legals'));

      // Act
      act(() => {
        dependencies.sessionManager.updateAppSession({ status: 'non-authenticated' });
      });

      // Assert
      // Language should not be changed on logout
      await waitFor(() => getByText('Privacy Policy & Legals'));

      // Act
      act(() => {
        dependencies.sessionManager.updateAppSession({
          status: 'authenticated',
          userData: {
            user: {
              lang: 'es',
              avatar: {},
              plan: {},
              sms: {},
              nav: [],
            },
            nav: [],
            features: {
              siteTrackingEnabled: false,
              siteTrackingActive: false,
              emailParameterEnabled: false,
              emailParameterActive: false,
            },
          },
        });
      });

      // Assert
      await waitFor(() => getByText('Política de Privacidad y Legales'));
    });
  });

  describe('authentication', () => {
    it('updates content after successful authentication', async () => {
      // Arrange
      const expectedEmail = 'fcoronel@makingsense.com';

      const appSessionRef = { current: { status: 'unknown' } };
      const dependencies = {
        appSessionRef: appSessionRef,
        sessionManager: createDoubleSessionManager(appSessionRef),
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      const { getByText, container } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/reports']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      const loadingEl = container.querySelector('.loading-page');
      expect(loadingEl).not.toBeNull();
      await waitFor(() => {});
      // Act
      act(() => {
        dependencies.sessionManager.updateAppSession({
          status: 'authenticated',
          userData: {
            user: {
              email: expectedEmail,
              avatar: {},
              plan: {},
              sms: {},
              nav: [],
              lang: 'en',
            },
            nav: [],
            features: {
              siteTrackingEnabled: false,
              siteTrackingActive: false,
              emailParameterEnabled: false,
              emailParameterActive: false,
            },
          },
        });
      });

      // Assert
      await waitFor(() => expect(getByText(expectedEmail)));
      // TODO: test session manager behavior
    });

    describe('not authenticated user', () => {
      it('should be redirected to Legacy Doppler Login after open /reports when useLegacy.login is active', async () => {
        const appSessionRef = { current: { status: 'unknown' } };
        const dependencies = {
          appSessionRef: appSessionRef,
          appConfiguration: {
            dopplerLegacyUrl: 'http://legacyUrl.localhost',
            useLegacy: { login: true },
          },
          window: {
            location: {
              protocol: 'http:',
              host: 'webapp.localhost',
              pathname: '/path1/path2/',
              href: 'unset',
            },
          },
          sessionManager: createDoubleSessionManager(appSessionRef),
          localStorage: createLocalStorageDouble(),
          dopplerSitesClient: dopplerSitesClientDouble,
        };

        const { container } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/reports']}>
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );

        const loadingEl = container.querySelector('.loading-page');
        expect(loadingEl).not.toBeNull();
        await waitFor(() => {});
        // Act
        act(() => {
          dependencies.sessionManager.updateAppSession({
            status: 'not-authenticated',
          });
        });

        // Assert
        await waitFor(() =>
          expect(dependencies.window.location.href).toEqual(
            'http://legacyUrl.localhost/SignIn/?redirect=http://webapp.localhost/path1/path2/#/reports',
          ),
        );
      });

      it('should be redirected to Internal Login after open /reports (when using RedirectToInternalLogin)', async () => {
        const appSessionRef = { current: { status: 'unknown' } };
        const dependencies = {
          appSessionRef: appSessionRef,
          sessionManager: createDoubleSessionManager(appSessionRef),
          dopplerSitesClient: dopplerSitesClientDouble,
        };

        const currentRouteState = {};

        const { container } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/reports?param1=value1#hash']}>
              <RouterInspector target={currentRouteState} />
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );

        expect(currentRouteState.location.pathname).toEqual('/reports');
        expect(currentRouteState.location.search).toEqual('?param1=value1');
        expect(currentRouteState.location.hash).toEqual('#hash');
        const loadingEl = container.querySelector('.loading-page');
        expect(loadingEl).not.toBeNull();
        await waitFor(() => {});
        // Act
        act(() => {
          dependencies.sessionManager.updateAppSession({
            status: 'not-authenticated',
          });
        });
        // Assert
        await waitFor(() => {
          expect(currentRouteState.location.pathname).toEqual('/login');
          expect(currentRouteState.location.state).toBeDefined();
          expect(currentRouteState.location.state.from).toBeDefined();
          expect(currentRouteState.location.state.from.pathname).toEqual('/reports');
          expect(currentRouteState.location.state.from.search).toEqual('?param1=value1');
          expect(currentRouteState.location.state.from.hash).toEqual('#hash');
          expect(currentRouteState.history.length).toEqual(1); // because the URL has been replaced in the redirect
          expect(currentRouteState.history.action).toEqual('REPLACE');
          const headerEl = container.querySelector('.header-main');
          expect(headerEl).toBeNull();
          const menuEl = container.querySelector('.menu-main');
          expect(menuEl).toBeNull();
          const footerEl = container.querySelector('.dp-footer');
          expect(footerEl).toBeNull();
        });
      });

      it('should not be redirected after open /login', async () => {
        const dependencies = defaultDependencies;

        const currentRouteState = {};

        const { container } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/login']}>
              <RouterInspector target={currentRouteState} />
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );

        {
          expect(currentRouteState.location.pathname).toEqual('/login');
          expect(currentRouteState.location.state).toBeUndefined();
          expect(currentRouteState.history.length).toEqual(1);
          expect(currentRouteState.history.action).not.toEqual('REPLACE');
          const headerEl = container.querySelector('.header-main');
          expect(headerEl).toBeNull();
          const menuEl = container.querySelector('.menu-main');
          expect(menuEl).toBeNull();
          const footerEl = container.querySelector('.dp-footer');
          expect(footerEl).toBeNull();
          const passwordEl = container.querySelector('#password');
          expect(passwordEl).toBeInstanceOf(HTMLInputElement);
        }
        await waitFor(() => {});
        // Act
        act(() => {
          dependencies.sessionManager.updateAppSession({
            status: 'not-authenticated',
          });
        });

        // Assert
        await waitFor(() => {
          expect(currentRouteState.location.pathname).toEqual('/login');
          expect(currentRouteState.location.state).toBeUndefined();
          expect(currentRouteState.history.length).toEqual(1);
          expect(currentRouteState.history.action).not.toEqual('REPLACE');
          const headerEl = container.querySelector('.header-main');
          expect(headerEl).toBeNull();
          const menuEl = container.querySelector('.menu-main');
          expect(menuEl).toBeNull();
          const footerEl = container.querySelector('.dp-footer');
          expect(footerEl).toBeNull();
          const passwordEl = container.querySelector('#password');
          expect(passwordEl).toBeInstanceOf(HTMLInputElement);
        });
      });

      it('should be redirected to /login when route does not exists', async () => {
        const appSessionRef = { current: { status: 'unknown' } };
        const dependencies = {
          appSessionRef: appSessionRef,
          sessionManager: createDoubleSessionManager(appSessionRef),
          dopplerSitesClient: dopplerSitesClientDouble,
        };

        const currentRouteState = {};

        const { container } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/this/route/does/not/exist']}>
              <RouterInspector target={currentRouteState} />
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );

        expect(currentRouteState.location.pathname).toEqual('/reports');
        expect(currentRouteState.location.state).toBeUndefined();
        const loadingEl = container.querySelector('.loading-page');
        expect(loadingEl).not.toBeNull();
        await waitFor(() => {});
        // Act
        act(() => {
          dependencies.sessionManager.updateAppSession({
            status: 'not-authenticated',
          });
        });

        // Assert
        await waitFor(() => {
          expect(currentRouteState.location.pathname).toEqual('/login');
          expect(currentRouteState.location.state).toBeDefined();
          expect(currentRouteState.location.state.from).toBeDefined();
          expect(currentRouteState.location.state.from.pathname).toEqual('/reports'); // because before redirecting to login, it redirected to reports
          expect(currentRouteState.history.length).toEqual(1); // because the URL has been replaced in the redirect
          expect(currentRouteState.history.action).toEqual('REPLACE');
          const headerEl = container.querySelector('.header-main');
          expect(headerEl).toBeNull();
          const menuEl = container.querySelector('.menu-main');
          expect(menuEl).toBeNull();
          const footerEl = container.querySelector('.dp-footer');
          expect(footerEl).toBeNull();
        });
      });
    });

    describe('authenticated user', () => {
      it('should be redirected to /reports when route does not exists', async () => {
        const appSessionRef = { current: { status: 'unknown' } };
        const dependencies = {
          appSessionRef: appSessionRef,
          sessionManager: createDoubleSessionManager(appSessionRef),
          dopplerSitesClient: dopplerSitesClientDouble,
        };

        const currentRouteState = {};

        const { container } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/this/route/does/not/exist?param1=value1#hash']}>
              <RouterInspector target={currentRouteState} />
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );

        expect(currentRouteState.location.pathname).toEqual('/reports');
        expect(currentRouteState.location.search).toEqual('');
        expect(currentRouteState.location.hash).toEqual('');
        const loadingEl = container.querySelector('.loading-page');
        expect(loadingEl).not.toBeNull();
        await waitFor(() => {});
        // Act
        act(() => {
          dependencies.sessionManager.updateAppSession({
            status: 'authenticated',
            userData: {
              user: {
                lang: 'es',
                avatar: {},
                plan: {},
                sms: {},
                nav: [],
              },
              nav: [],
              features: {
                siteTrackingEnabled: false,
                siteTrackingActive: false,
                emailParameterEnabled: false,
                emailParameterActive: false,
              },
            },
          });
        });
        // Assert
        await waitFor(() => {
          expect(currentRouteState.location.state).toBeUndefined();
          expect(currentRouteState.history.length).toEqual(1);
          expect(currentRouteState.history.action).toEqual('REPLACE');
          const headerEl = container.querySelector('.header-main');
          expect(headerEl).not.toBeNull();
          const menuEl = container.querySelector('.menu-main');
          expect(menuEl).not.toBeNull();
          const footerEl = container.querySelector('.dp-footer');
          expect(footerEl).not.toBeNull();
        });
      });

      it('should keep /reports path when the authenticated state is verified', async () => {
        const appSessionRef = { current: { status: 'unknown' } };
        const dependencies = {
          appSessionRef: appSessionRef,
          sessionManager: createDoubleSessionManager(appSessionRef),
          dopplerSitesClient: dopplerSitesClientDouble,
        };

        const currentRouteState = {};

        const { container } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/reports?param1=value1#hash']}>
              <RouterInspector target={currentRouteState} />
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );

        expect(currentRouteState.location.pathname).toEqual('/reports');
        expect(currentRouteState.location.search).toEqual('?param1=value1');
        expect(currentRouteState.location.hash).toEqual('#hash');
        const loadingEl = container.querySelector('.loading-page');
        expect(loadingEl).not.toBeNull();
        await waitFor(() => {});
        // Act
        act(() => {
          dependencies.sessionManager.updateAppSession({
            status: 'authenticated',
            userData: {
              user: {
                lang: 'es',
                avatar: {},
                plan: {},
                sms: {},
                nav: [],
              },
              nav: [],
              features: {
                siteTrackingEnabled: false,
                siteTrackingActive: false,
                emailParameterEnabled: false,
                emailParameterActive: false,
              },
            },
          });
        });

        // Assert
        await waitFor(() => {
          expect(currentRouteState.location.pathname).toEqual('/reports');
          expect(currentRouteState.location.search).toEqual('?param1=value1');
          expect(currentRouteState.location.hash).toEqual('#hash');
          expect(currentRouteState.location.state).toBeUndefined();
          expect(currentRouteState.history.length).toEqual(1);
          expect(currentRouteState.history.action).not.toEqual('REPLACE');
          const headerEl = container.querySelector('.header-main');
          expect(headerEl).not.toBeNull();
          const menuEl = container.querySelector('.menu-main');
          expect(menuEl).not.toBeNull();
          const footerEl = container.querySelector('.dp-footer');
          expect(footerEl).not.toBeNull();
        });
      });
    });
  });

  describe('origin parameter', () => {
    // TODO: fix this tests console warning
    it('should be stored in the local storage', async () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      createJsonParse();

      // Act
      act(() => {
        render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/signup?origin=testOrigin']}>
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );
      });

      // Assert
      const localStorageItems = dependencies.localStorage.getAllItems();
      await waitFor(() => {
        expect(localStorageItems['dopplerFirstOrigin.value']).toBeDefined();
        expect(localStorageItems['dopplerFirstOrigin.value']).toEqual('testOrigin');
        expect(localStorageItems['dopplerFirstOrigin.date']).toBeDefined();
        expect(localStorageItems['UtmCookies']).toBeDefined();
        const dopplerOriginDate = new Date(localStorageItems['dopplerFirstOrigin.date']);
        expect(dopplerOriginDate).toBeDefined();
        expect(dopplerOriginDate.getFullYear()).toBeGreaterThan(2018);
      });
    });

    it('should check utm parameters are stored', async () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      createJsonParse();

      // Act
      act(() => {
        render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router
              initialEntries={[
                '/signup?origin=testOrigin&utm_source=test&utm_campaign=testcampaign&utm_medium=testmedium&utm_term=testterm',
              ]}
            >
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );
      });

      // Assert
      const localStorageItems = dependencies.localStorage.getAllItems();
      await waitFor(() => {
        expect(localStorageItems['UtmCookies']).toBeDefined();
        expect(localStorageItems['UtmCookies']).toMatch('UTMSource');
        expect(localStorageItems['UtmCookies']).toMatch('test');
        expect(localStorageItems['UtmCookies']).toMatch('UTMCampaign');
        expect(localStorageItems['UtmCookies']).toMatch('testcampaign');
        expect(localStorageItems['UtmCookies']).toMatch('UTMMedium');
        expect(localStorageItems['UtmCookies']).toMatch('testmedium');
        expect(localStorageItems['UtmCookies']).toMatch('UTMTerm');
        expect(localStorageItems['UtmCookies']).toMatch('testterm');
      });
    });

    it('should accumulate utm parameters when there was a previous navigation', async () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      const utmCookie = {
        date: new Date().toISOString(),
        UTMSource: 'utmsource1',
        UTMCampaign: 'utmcampaign1',
        UTMMedium: 'utmmedium1',
        UTMTerm: 'utmterm1',
      };
      dependencies.localStorage.setItem('UtmCookies', JSON.stringify(utmCookie));
      createJsonParse(utmCookie);
      // Act
      act(() => {
        render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router
              initialEntries={[
                '/signup?origin=testOrigin&utm_source=test&utm_campaign=testcampaign&utm_medium=testmedium&utm_term=testterm',
              ]}
            >
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );
      });

      // Assert
      const localStorageItems = dependencies.localStorage.getAllItems();
      await waitFor(() => {
        expect(localStorageItems['UtmCookies']).toBeDefined();
        expect(localStorageItems['UtmCookies']).toMatch('UTMSource');
        expect(localStorageItems['UtmCookies']).toMatch('test');
        expect(localStorageItems['UtmCookies']).toMatch('UTMCampaign');
        expect(localStorageItems['UtmCookies']).toMatch('testcampaign');
        expect(localStorageItems['UtmCookies']).toMatch('UTMMedium');
        expect(localStorageItems['UtmCookies']).toMatch('testmedium');
        expect(localStorageItems['UtmCookies']).toMatch('UTMTerm');
        expect(localStorageItems['UtmCookies']).toMatch('testterm');
        expect(localStorageItems['UtmCookies']).toMatch('utmsource1');
        expect(localStorageItems['UtmCookies']).toMatch('utmcampaign1');
        expect(localStorageItems['UtmCookies']).toMatch('utmmedium1');
        expect(localStorageItems['UtmCookies']).toMatch('utmterm1');
      });
    });

    // TODO: fix this tests console warning
    it('should not be replaced in local storage if it already exists', async () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      const oldValue = 'old value';
      dependencies.localStorage.setItem('dopplerFirstOrigin.value', oldValue);

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/signup?origin=testOrigin']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      const localStorageItems = dependencies.localStorage.getAllItems();
      await waitFor(() => {
        expect(localStorageItems['dopplerFirstOrigin.value']).toBeDefined();
        expect(localStorageItems['dopplerFirstOrigin.value']).toEqual(oldValue);
      });
    });

    // TODO: fix this tests console warning
    it('should not be cleaned in local storage when there is not origin URL parameter', async () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      const oldValue = 'old value';
      dependencies.localStorage.setItem('dopplerFirstOrigin.value', oldValue);

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/signup']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      const localStorageItems = dependencies.localStorage.getAllItems();
      await waitFor(() => {
        expect(localStorageItems['dopplerFirstOrigin.value']).toBeDefined();
        expect(localStorageItems['dopplerFirstOrigin.value']).toEqual(oldValue);
      });
    });

    // TODO: fix this tests console warning
    it('should not be set in local storage when there is not origin URL parameter', async () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/signup']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      const localStorageItems = dependencies.localStorage.getAllItems();
      await waitFor(() => expect(localStorageItems['dopplerFirstOrigin.value']).toBeUndefined());
    });
  });

  describe('google adwords', () => {
    // TODO: fix this tests console warning
    it('should be called when query string contains activationInProgress%20=%20true', async () => {
      // Arrange
      const dependencies = {
        window: {
          gtag: jest.fn(),
        },
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login?activationInProgress%20=%20true']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(dependencies.window.gtag).toBeCalledTimes(1));
    });

    it('should not be called when query string does not contain activationInProgress parameter.', async () => {
      // Arrange
      const dependencies = {
        window: {
          gtag: jest.fn(),
        },
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(dependencies.window.gtag).not.toBeCalled());
    });

    it('should be called when query string contains activationInProgress=true', async () => {
      // Arrange
      const dependencies = {
        window: {
          gtag: jest.fn(),
        },
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login?activationInProgress=true']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(dependencies.window.gtag).toBeCalledTimes(1));
    });

    it('should not be called when query string activationInProgress parameter is not true', async () => {
      // Arrange
      const dependencies = {
        window: {
          gtag: jest.fn(),
        },
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login?activationInProgress=false']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(dependencies.window.gtag).not.toBeCalled());
    });

    // TODO: fix this tests console warning
    it('should not be called when query string activationInProgress has no value.', async () => {
      // Arrange
      const dependencies = {
        window: {
          gtag: jest.fn(),
        },
        dopplerSitesClient: dopplerSitesClientDouble,
      };

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login?activationInProgress']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(dependencies.window.gtag).not.toBeCalled());
    });
  });
});
