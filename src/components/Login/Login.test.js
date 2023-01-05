import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { MemoryRouter as Router } from 'react-router-dom';
import Login, { getPathFromLocation } from './Login';
import { AppServicesProvider } from '../../services/pure-di';

describe('Login component', () => {
  afterEach(cleanup);

  it('renders Login without error', async () => {
    // Arrange
    const dependencies = {
      window: {
        location: {},
      },
    };
    const location = {
      state: {
        email: '',
      },
      search: '',
    };

    // Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router>
            <Login location={location} />
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    await waitFor(() => expect(getByText('login.button_login')).toBeInTheDocument());
  });

  describe('getPathFromLocation', () => {
    it('should return a path when location has state', async () => {
      // Arrange
      const location = {
        pathname: '/login', // current pathname
        state: {
          from: {
            pathname: '/plan-selection/premium/by-contacts', // previous pathname
            search: '?param1=test1&param2=test2',
          },
        },
      };

      // Act
      const path = getPathFromLocation(location);

      // Assert
      expect(path).toBe('/plan-selection/premium/by-contacts?param1=test1&param2=test2');
    });

    it('should return "/" when has not previous page', async () => {
      // Arrange
      const location = {
        pathname: '/login', // current pathname
        state: null,
      };

      // Act
      const path = getPathFromLocation(location);

      // Assert
      expect(path).toBe('/');
    });
  });
});
