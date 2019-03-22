import React from 'react';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';
import App from './App';
import { AppServicesProvider } from './services/pure-di';
import { RedirectToInternalLogin } from './components/RedirectToLogin';
import { MemoryRouter as Router, withRouter } from 'react-router-dom';

function createDoubleSessionManager() {
  const double = {
    initialize: (handler) => {
      double.updateAppSession = handler;
    },
    finalize: () => {},
    session: {
      status: 'unknown',
    },
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
          <App locale="en" />
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
          <App locale="es" />
        </AppServicesProvider>,
      );

      // Assert
      getByText('Cargando...');
    });

    it("should be updated based on user's data", () => {
      // Arrange
      const dependencies = {
        sessionManager: createDoubleSessionManager(),
      };

      const { getByText } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router>
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
        },
      });

      // Assert
      getByText('Políticas de privacidad y legales.');

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
        },
      });

      // Assert
      getByText('Privacy Policy & Legals.');

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

      const dependencies = {
        sessionManager: createDoubleSessionManager(),
      };

      const { getByText } = render(
        <AppServicesProvider forcedServices={dependencies}>
          <Router>
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
        },
      });

      // Assert
      getByText(expectedEmail);
      // TODO: test session manager behavior
    });

    describe('not authenticated user', () => {
      it('should be redirected to Legacy Doppler Login after open /reports (when using RedirectToLegacyLoginFactory)', () => {
        const dependencies = {
          appConfiguration: {
            dopplerLegacyUrl: 'http://legacyUrl.localhost',
          },
          window: {
            location: {
              protocol: 'http:',
              host: 'webapp.localhost',
              pathname: '/path1/path2/',
              href: 'unset',
            },
          },
          sessionManager: createDoubleSessionManager(),
        };

        const { getByText } = render(
          <AppServicesProvider forcedServices={dependencies}>
            <Router>
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
          'http://legacyUrl.localhost/SignIn/index?redirect=http://webapp.localhost/path1/path2/#/reports',
        );
      });

      it('should be redirected to Internal Login after open /reports (when using RedirectToInternalLogin)', () => {
        const dependencies = {
          RedirectToLogin: RedirectToInternalLogin,
          sessionManager: createDoubleSessionManager(),
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
    });
  });
});
