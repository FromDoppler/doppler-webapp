import React from 'react';
import { render, cleanup, waitForDomChange, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { MemoryRouter as Router } from 'react-router-dom';
import Login from './Login';
import { AppServicesProvider } from '../../services/pure-di';
import { Formik } from 'formik';

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
    };

    // Act
    const { container, getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router>
            <Login location={location} />
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    await waitForDomChange();
    console.log(container);
    expect(getByText('login.button_login')).toBeInTheDocument();
  });
});
