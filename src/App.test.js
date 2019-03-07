import React from 'react';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';
import App from './App';

function createDoubleSessionManager() {
  const double = {
    initialize: (handler) => {
      double.updateAppSession = handler;
    },
    finalize: () => {},
    session: {
      status: 'non-authenticated',
    },
  };
  return double;
}

describe('App component', () => {
  afterEach(cleanup);

  it('renders loading text in English', () => {
    // Arrange
    const dependencies = {
      sessionManager: createDoubleSessionManager(),
    };

    // Act
    const { getByText } = render(<App locale="en" dependencies={dependencies} />);

    // Assert
    getByText('Loading...');
  });

  it('renders loading text in Spanish', () => {
    // Arrange
    const dependencies = {
      sessionManager: createDoubleSessionManager(),
    };

    // Act
    const { getByText } = render(<App locale="es" dependencies={dependencies} />);

    // Assert
    getByText('Cargando...');
  });

  it('updates content after successful authentication', async () => {
    // Arrange
    const expectedEmail = 'fcoronel@makingsense.com';

    const dependencies = {
      sessionManager: createDoubleSessionManager(),
    };

    const { getByText } = render(<App locale="en" dependencies={dependencies} />);

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
        },
        nav: [],
      },
    });

    // Assert
    getByText(expectedEmail);
    // TODO: test session manager behavior
  });
});
