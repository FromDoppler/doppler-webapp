import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter as Router, useLocation } from 'react-router-dom';
import App from './App';
import { PLAN_TYPE, URL_PLAN_TYPE } from './doppler-types';
import { AppServicesProvider } from './services/pure-di';
import { UtmCookiesManager } from './services/utm-cookies-manager';

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

const RouterInspector = ({ target }) => {
  const location = useLocation();

  target.location = location;
  return null;
};

const emptyResponse = { success: false, error: new Error('Dummy error') };

const rejectedPromise = Promise.resolve({ success: false, value: '' });
const dopplerSitesClientDouble = {
  getBannerData: jest.fn(async () => rejectedPromise),
};

const parse = JSON.parse;

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

const window = {
  zE: () => null,
};

const defaultDependencies = {
  sessionManager: createDoubleSessionManager(),
  dopplerSitesClient: dopplerSitesClientDouble,
};

const getSurveyFormStatusMock = async () => ({
  success: true,
  value: { surveyFormCompleted: true },
});

const reportDependencies = {
  dopplerLegacyClient: {
    getSurveyFormStatus: getSurveyFormStatusMock,
  },
  datahubClient: {
    getAccountDomains: async () => ({
      success: true,
      value: [],
    }),
    getTrafficSourcesByPeriod: async () => ({
      success: true,
      value: [],
    }),
    getPagesRankingByPeriod: async () => ({
      success: true,
      value: {
        hasMorePages: false,
        pages: [],
      },
    }),
  },
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
            <App window={window} locale="en" />
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
            <App window={window} locale="es" />
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
            <App window={window} locale="fr" />
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
            <App window={window} />
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
        ...reportDependencies,
      };

      const { getByText, container } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/reports']}>
            <App window={window} locale="en" />
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
        ...reportDependencies,
      };

      const { container } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/reports']}>
            <App window={window} locale="en" />
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
      const loadingElNow = container.querySelector('.loading-page');
      expect(loadingElNow).toBeNull();
      expect(await screen.findByTestId('empty-fragment')).toBeInTheDocument();
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
              <App window={window} locale="en" />
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
            <Router
              initialEntries={['/reports?param1=value1#hash']}
              location="/reports?param1=value1#hash"
            >
              <RouterInspector target={currentRouteState} />
              <App window={window} locale="en" />
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
              <App window={window} locale="en" />
            </Router>
          </AppServicesProvider>,
        );

        {
          expect(currentRouteState.location.pathname).toEqual('/login');
          expect(currentRouteState.location.state).toBeNull();
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
          expect(currentRouteState.location.state).toBeNull();
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
              <App window={window} locale="en" />
            </Router>
          </AppServicesProvider>,
        );

        expect(currentRouteState.location.pathname).toEqual('/reports');
        expect(currentRouteState.location.state).toBeNull();
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
          ...reportDependencies,
        };

        const currentRouteState = {};

        const { container } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/this/route/does/not/exist?param1=value1#hash']}>
              <RouterInspector target={currentRouteState} />
              <App window={window} locale="en" />
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
                siteTrackingEnabled: true,
                siteTrackingActive: true,
                emailParameterEnabled: true,
                emailParameterActive: true,
              },
              datahubCustomerId: true,
            },
          });
        });
        // Assert
        await waitFor(() => {
          expect(currentRouteState.location.state).toBeNull();
          const reportsPageWithoutDomainsEl = container.querySelector('.patch-no-domains');
          expect(reportsPageWithoutDomainsEl).not.toBeNull();
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
          ...reportDependencies,
        };

        const currentRouteState = {};

        const { container } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/reports?param1=value1#hash']}>
              <RouterInspector target={currentRouteState} />
              <App window={window} locale="en" />
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
                siteTrackingEnabled: true,
                siteTrackingActive: true,
                emailParameterEnabled: true,
                emailParameterActive: true,
              },
              datahubCustomerId: true,
            },
          });
        });

        // Assert
        await waitFor(() => {
          expect(currentRouteState.location.pathname).toEqual('/reports');
          expect(currentRouteState.location.search).toEqual('?param1=value1');
          expect(currentRouteState.location.hash).toEqual('#hash');
          expect(currentRouteState.location.state).toBeNull();
          const reportsPageWithoutDomainsEl = container.querySelector('.patch-no-domains');
          expect(reportsPageWithoutDomainsEl).not.toBeNull();
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
        dopplerSitesClient: dopplerSitesClientDouble,
        utmCookiesManager: new UtmCookiesManager({ document: { cookie: '' } }),
      };

      // Act
      act(() => {
        render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/signup?utm_source=testOrigin']}>
              <App window={window} locale="en" />
            </Router>
          </AppServicesProvider>,
        );
      });

      // Assert
      const localStorageItems = dependencies.utmCookiesManager.getUtmCookie();
      await waitFor(() => {
        expect(localStorageItems).toBeDefined();
        expect(localStorageItems[0].UTMSource).toEqual('testOrigin');
        expect(localStorageItems[0].date).toBeDefined();
        const dopplerOriginDate = new Date(localStorageItems[0].date);
        expect(dopplerOriginDate).toBeDefined();
        expect(dopplerOriginDate.getFullYear()).toBeGreaterThan(2018);
      });
    });

    it('should check utm parameters are stored', async () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        dopplerSitesClient: dopplerSitesClientDouble,
        utmCookiesManager: new UtmCookiesManager({ document: { cookie: '' } }),
      };

      // Act
      act(() => {
        render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router
              initialEntries={[
                '/signup?origin=testOrigin&utm_source=test&utm_campaign=testcampaign&utm_medium=testmedium&utm_term=testterm&gclid=testgclid',
              ]}
            >
              <App window={window} locale="en" />
            </Router>
          </AppServicesProvider>,
        );
      });

      // Assert
      const localStorageItems = dependencies.utmCookiesManager.getUtmCookie();

      await waitFor(() => {
        expect(localStorageItems).toBeDefined();
        expect(localStorageItems[0].UTMTerm).toEqual('testterm');
        expect(localStorageItems[0].UTMCampaign).toEqual('testcampaign');
        expect(localStorageItems[0].UTMMedium).toEqual('testmedium');
        expect(localStorageItems[0].gclid).toEqual('testgclid');
        expect(localStorageItems[0].UTMSource).toEqual('test');
      });
    });

    it('should accumulate utm parameters when there was a previous navigation', async () => {
      // Arrange
      const fakeDocument = { document: { cookie: '' } };
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        dopplerSitesClient: dopplerSitesClientDouble,
        utmCookiesManager: new UtmCookiesManager(fakeDocument),
      };

      const utmCookie = [
        {
          UTMSource: 'utmsource1',
          UTMCampaign: 'utmcampaign1',
          UTMMedium: 'utmmedium1',
          UTMTerm: 'utmterm1',
          gclid: 'gclid1',
        },
      ];

      const cookiesAsJsonString = JSON.stringify(utmCookie);
      fakeDocument.cookie =
        'UtmCookies' +
        '=' +
        cookiesAsJsonString +
        '; domain=.fromdoppler.com; path=/; expires=Fri, 31 Dec 2038 23:59:59 GMT;';

      // Act
      act(() => {
        render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router
              initialEntries={[
                '/signup?origin=testOrigin&utm_source=test&utm_campaign=testcampaign&utm_medium=testmedium&utm_term=testterm&gclid=testgclid',
              ]}
            >
              <App window={window} locale="en" />
            </Router>
          </AppServicesProvider>,
        );
      });

      // Assert
      const localStorageItems = dependencies.utmCookiesManager.getUtmCookie();

      await waitFor(() => {
        expect(localStorageItems).toBeDefined();
        expect(localStorageItems[0].UTMTerm).toEqual('utmterm1');
        expect(localStorageItems[0].UTMCampaign).toEqual('utmcampaign1');
        expect(localStorageItems[0].UTMMedium).toEqual('utmmedium1');
        expect(localStorageItems[0].UTMSource).toEqual('utmsource1');
        expect(localStorageItems[0].gclid).toEqual('gclid1');
        expect(localStorageItems[1].UTMTerm).toEqual('testterm');
        expect(localStorageItems[1].UTMCampaign).toEqual('testcampaign');
        expect(localStorageItems[1].UTMMedium).toEqual('testmedium');
        expect(localStorageItems[1].UTMSource).toEqual('test');
        expect(localStorageItems[1].gclid).toEqual('testgclid');
        expect(localStorageItems.length).toBeGreaterThan(1);
      });
    });

    // TODO: fix this tests console warning
    it('should not be replaced in local storage if it already exists', async () => {
      // Arrange
      const fakeDocument = { document: { cookie: '' } };
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        // localStorage: createLocalStorageDouble(),
        dopplerSitesClient: dopplerSitesClientDouble,
        utmCookiesManager: new UtmCookiesManager(fakeDocument),
      };

      const oldValue = 'old value';
      dependencies.utmCookiesManager.setCookieEntry({ origin: oldValue });

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/signup?origin=testOrigin']}>
            <App window={window} locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      const localStorageItems = dependencies.utmCookiesManager.getUtmCookie();
      await waitFor(() => {
        expect(localStorageItems).toBeDefined();
        expect(localStorageItems.length).toBe(1);
        expect(localStorageItems[0]).toBeDefined();
        expect(localStorageItems[0].origin).toEqual(oldValue);
      });
    });

    // TODO: fix this tests console warning
    it('should not be cleaned in local storage when there is not origin URL parameter', async () => {
      // Arrange
      const fakeDocument = { document: { cookie: '' } };

      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        dopplerSitesClient: dopplerSitesClientDouble,
        utmCookiesManager: new UtmCookiesManager(fakeDocument),
      };

      const oldValue = 'old value';

      const cookiesAsJsonString = JSON.stringify([{ origin: oldValue }]);
      fakeDocument.cookie =
        'UtmCookies=' +
        cookiesAsJsonString +
        '; domain=.fromdoppler.com; path=/; expires=Fri, 31 Dec 2038 23:59:59 GMT;';

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/signup']}>
            <App window={window} locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      const localStorageItems = dependencies.utmCookiesManager.getUtmCookie();
      await waitFor(() => {
        expect(localStorageItems).toBeDefined();
        expect(localStorageItems[0]).toBeDefined();
        expect(localStorageItems[0].origin).toEqual(oldValue);
      });
    });

    // TODO: fix this tests console warning
    it('should not be set in local storage when there is not origin URL parameter', async () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
        dopplerSitesClient: dopplerSitesClientDouble,
        utmCookiesManager: new UtmCookiesManager({ document: { cookie: '' } }),
      };

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/signup']}>
            <App window={window} locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      const localStorageItems = dependencies.localStorage.getAllItems();
      await waitFor(() => expect(localStorageItems['dopplerFirstOrigin.value']).toBeUndefined());
    });
  });

  describe('google adwords', () => {
    let dependencies;
    beforeEach(() => {
      // Arrange
      dependencies = {
        window: {
          gtag: jest.fn(),
        },
        sessionManager: createDoubleSessionManager(),
        dopplerSitesClient: dopplerSitesClientDouble,
        experimentalFeatures: {
          getFeature: () => null,
        },
      };
    });

    // TODO: fix this tests console warning
    it('should be called when query string contains activationInProgress%20=%20true', async () => {
      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login?activationInProgress%20=%20true']}>
            <App window={window} locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(dependencies.window.gtag).toBeCalledTimes(1));
    });

    it('should not be called when query string does not contain activationInProgress parameter.', async () => {
      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login']}>
            <App window={window} locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(dependencies.window.gtag).not.toBeCalled());
    });

    it('should be called when query string contains activationInProgress=true', async () => {
      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login?activationInProgress=true']}>
            <App window={window} locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(dependencies.window.gtag).toBeCalledTimes(1));
    });

    it('should not be called when query string activationInProgress parameter is not true', async () => {
      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login?activationInProgress=false']}>
            <App window={window} locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(dependencies.window.gtag).not.toBeCalled());
    });

    // TODO: fix this tests console warning
    it('should not be called when query string activationInProgress has no value.', async () => {
      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/login?activationInProgress']}>
            <App window={window} locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      await waitFor(() => expect(dependencies.window.gtag).not.toBeCalled());
    });
  });

  describe('PlanCalculator URL', () => {
    const redirectUrl = `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`;

    it(`should redirect to ${redirectUrl} when has not query params`, async () => {
      // Act
      const appSessionRef = { current: { status: 'unknown' } };
      const dependencies = {
        appSessionRef: appSessionRef,
        sessionManager: createDoubleSessionManager(appSessionRef),
        dopplerSitesClient: dopplerSitesClientDouble,
      };
      const currentRouteState = {};

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={[`/plan-selection`]}>
            <RouterInspector target={currentRouteState} />
            <App window={window} locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      expect(currentRouteState.location.pathname).toEqual(redirectUrl);
      expect(currentRouteState.location.search).toEqual('');
    });

    it(`should redirect to ${redirectUrl} when has query params`, async () => {
      // Act
      const promoCode = 'fake-promo-code';
      const appSessionRef = { current: { status: 'unknown' } };
      const dependencies = {
        appSessionRef: appSessionRef,
        sessionManager: createDoubleSessionManager(appSessionRef),
        dopplerSitesClient: dopplerSitesClientDouble,
      };
      const currentRouteState = {};

      // Act
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={[`/plan-selection?promo-code=${promoCode}`]}>
            <RouterInspector target={currentRouteState} />
            <App window={window} locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      expect(currentRouteState.location.pathname).toEqual(redirectUrl);
      expect(currentRouteState.location.search).toEqual(`?promo-code=${promoCode}`);
    });
  });
});
