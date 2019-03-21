import React from 'react';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';
import App from './App';
import { AppServicesProvider } from './services/pure-di';

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
          <App locale="en" />
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

  it('updates content after successful authentication', async () => {
    // Arrange
    const expectedEmail = 'fcoronel@makingsense.com';

    const dependencies = {
      sessionManager: createDoubleSessionManager(),
    };

    const { getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <App locale="en" />
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
});
