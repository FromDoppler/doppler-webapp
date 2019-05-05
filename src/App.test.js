import React from 'react';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';
import App from './App';
import { AppServicesProvider } from './services/pure-di';
import { MemoryRouter as Router, withRouter } from 'react-router-dom';

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

describe('App component', () => {
  afterEach(cleanup);

  describe('language', () => {
    it('should make honor to locale="en"', () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
      };

      // Act
      const { getByText } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/reports']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      getByText('Loading...');
    });

    it('should make honor to locale="es"', () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
      };

      // Act
      const { getByText } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/reports']}>
            <App locale="es" />
          </Router>
        </AppServicesProvider>,
      );

      // Assert
      getByText('Cargando...');
    });

    it("should be updated based on user's data", () => {
      // Arrange
      const appSessionRef = { current: { status: 'unknown' } };
      const dependencies = {
        appSessionRef: appSessionRef,
        sessionManager: createDoubleSessionManager(appSessionRef),
      };

      const { getByText } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/reports']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      getByText('Loading...');

      // Act
      dependencies.sessionManager.updateAppSession({
        status: 'authenticated',
        userData: {
          user: {
            lang: 'es',
            avatar: {},
            plan: {},
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

      // Assert
      getByText('Política de Privacidad y Legales');

      // Act
      dependencies.sessionManager.updateAppSession({
        status: 'authenticated',
        userData: {
          user: {
            lang: 'en',
            avatar: {},
            plan: {},
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

      // Assert
      getByText('Privacy and Legal Policy');

      // Act
      dependencies.sessionManager.updateAppSession({ status: 'unknown' });

      // Assert
      // Language should not be changed on logout
      getByText('Loading...');

      // Act
      dependencies.sessionManager.updateAppSession({
        status: 'authenticated',
        userData: {
          user: {
            lang: 'es',
            avatar: {},
            plan: {},
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
      dependencies.sessionManager.updateAppSession({ status: 'unknown' });

      // Assert
      getByText('Cargando...');
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
      };

      const { getByText } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router initialEntries={['/reports']}>
            <App locale="en" />
          </Router>
        </AppServicesProvider>,
      );

      getByText('Loading...');

      // Act
      dependencies.sessionManager.updateAppSession({
        status: 'authenticated',
        userData: {
          user: {
            email: expectedEmail,
            avatar: {},
            plan: {},
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

      // Assert
      getByText(expectedEmail);
      // TODO: test session manager behavior
    });

    describe('not authenticated user', () => {
      it('should be redirected to Legacy Doppler Login after open /reports when useLegacy.login is active', () => {
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
        };

        const { getByText } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/reports']}>
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );

        getByText('Loading...');

        // Act
        dependencies.sessionManager.updateAppSession({
          status: 'not-authenticated',
        });

        // Assert
        expect(dependencies.window.location.href).toEqual(
          'http://legacyUrl.localhost/SignIn/?redirect=http://webapp.localhost/path1/path2/#/reports',
        );
      });

      it('should be redirected to Internal Login after open /reports (when using RedirectToInternalLogin)', () => {
        const appSessionRef = { current: { status: 'unknown' } };
        const dependencies = {
          appSessionRef: appSessionRef,
          sessionManager: createDoubleSessionManager(appSessionRef),
        };

        const currentRouteState = {};

        const { getByText, container } = render(
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
        getByText('Loading...');

        // Act
        dependencies.sessionManager.updateAppSession({
          status: 'not-authenticated',
        });

        // Assert
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
        const footerEl = container.querySelector('.footer-main');
        expect(footerEl).toBeNull();
      });

      it('should not be redirected after open /login', () => {
        const dependencies = {
          sessionManager: createDoubleSessionManager(),
        };

        const currentRouteState = {};

        const { getByText, container } = render(
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
          const footerEl = container.querySelector('.footer-main');
          expect(footerEl).toBeNull();
          const passwordEl = container.querySelector('#password');
          expect(passwordEl).toBeInstanceOf(HTMLInputElement);
        }

        // Act
        dependencies.sessionManager.updateAppSession({
          status: 'not-authenticated',
        });

        // Assert
        expect(currentRouteState.location.pathname).toEqual('/login');
        expect(currentRouteState.location.state).toBeUndefined();
        expect(currentRouteState.history.length).toEqual(1);
        expect(currentRouteState.history.action).not.toEqual('REPLACE');
        const headerEl = container.querySelector('.header-main');
        expect(headerEl).toBeNull();
        const menuEl = container.querySelector('.menu-main');
        expect(menuEl).toBeNull();
        const footerEl = container.querySelector('.footer-main');
        expect(footerEl).toBeNull();
        const passwordEl = container.querySelector('#password');
        expect(passwordEl).toBeInstanceOf(HTMLInputElement);
      });

      it('should be redirected to /login when route does not exists', () => {
        const appSessionRef = { current: { status: 'unknown' } };
        const dependencies = {
          appSessionRef: appSessionRef,
          sessionManager: createDoubleSessionManager(appSessionRef),
        };

        const currentRouteState = {};

        const { getByText, container } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router initialEntries={['/this/route/does/not/exist']}>
              <RouterInspector target={currentRouteState} />
              <App locale="en" />
            </Router>
          </AppServicesProvider>,
        );

        expect(currentRouteState.location.pathname).toEqual('/reports');
        expect(currentRouteState.location.state).toBeUndefined();
        getByText('Loading...');

        // Act
        dependencies.sessionManager.updateAppSession({
          status: 'not-authenticated',
        });

        // Assert
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
        const footerEl = container.querySelector('.footer-main');
        expect(footerEl).toBeNull();
      });
    });

    describe('authenticated user', () => {
      it('should be redirected to /reports when route does not exists', () => {
        const appSessionRef = { current: { status: 'unknown' } };
        const dependencies = {
          appSessionRef: appSessionRef,
          sessionManager: createDoubleSessionManager(appSessionRef),
        };

        const currentRouteState = {};

        const { getByText, container } = render(
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
        getByText('Loading...');

        // Act
        dependencies.sessionManager.updateAppSession({
          status: 'authenticated',
          userData: {
            user: {
              lang: 'es',
              avatar: {},
              plan: {},
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

        // Assert
        expect(currentRouteState.location.state).toBeUndefined();
        expect(currentRouteState.history.length).toEqual(1);
        expect(currentRouteState.history.action).toEqual('REPLACE');
        const headerEl = container.querySelector('.header-main');
        expect(headerEl).not.toBeNull();
        const menuEl = container.querySelector('.menu-main');
        expect(menuEl).not.toBeNull();
        const footerEl = container.querySelector('.footer-main');
        expect(footerEl).not.toBeNull();
      });

      it('should keep /reports path when the authenticated state is verified', () => {
        const appSessionRef = { current: { status: 'unknown' } };
        const dependencies = {
          appSessionRef: appSessionRef,
          sessionManager: createDoubleSessionManager(appSessionRef),
        };

        const currentRouteState = {};

        const { getByText, container } = render(
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
        getByText('Loading...');

        // Act
        dependencies.sessionManager.updateAppSession({
          status: 'authenticated',
          userData: {
            user: {
              lang: 'es',
              avatar: {},
              plan: {},
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

        // Assert
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
        const footerEl = container.querySelector('.footer-main');
        expect(footerEl).not.toBeNull();
      });
    });
  });

  describe('origin parameter', () => {
    it('should be stored in the local storage', () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
      };

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
      expect(localStorageItems['dopplerFirstOrigin.value']).toBeDefined();
      expect(localStorageItems['dopplerFirstOrigin.value']).toEqual('testOrigin');
      expect(localStorageItems['dopplerFirstOrigin.date']).toBeDefined();
      const dopplerOriginDate = new Date(localStorageItems['dopplerFirstOrigin.date']);
      expect(dopplerOriginDate).toBeDefined();
      expect(dopplerOriginDate.getFullYear()).toBeGreaterThan(2018);
    });

    it('should not be replaced in local storage if it already exists', () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
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
      expect(localStorageItems['dopplerFirstOrigin.value']).toBeDefined();
      expect(localStorageItems['dopplerFirstOrigin.value']).toEqual(oldValue);
    });

    it('should not be cleaned in local storage when there is not origin URL parameter', () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
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
      expect(localStorageItems['dopplerFirstOrigin.value']).toBeDefined();
      expect(localStorageItems['dopplerFirstOrigin.value']).toEqual(oldValue);
    });

    it('should not be set in local storage when there is not origin URL parameter', () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
        localStorage: createLocalStorageDouble(),
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
      expect(localStorageItems['dopplerFirstOrigin.value']).toBeUndefined();
    });
  });
});
