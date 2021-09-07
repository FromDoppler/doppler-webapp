import React from 'react';
import { render, waitForElementToBeRemoved, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthorizationPage } from './AuthorizationPage';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import userEvent from '@testing-library/user-event';

describe('test for validate authorization form component ', () => {
  const result = {
    emails: ['email1@gmail.com', 'email2@gmail.com', 'email3@gmail.com'],
  };

  const bigQueryClientDouble = (success) => ({
    getEmailsData: async () => {
      return { emails: result.emails };
    },
    saveEmailsData: async () => {
      return { success: success };
    },
    notifyNewEmails: async () => ({
      success: success,
    }),
  });

  const featuresDouble = (bigQueryEnabled) => ({
    bigQuery: bigQueryEnabled,
  });

  const dopplerUserApiClientDouble = (bigQueryEnabled, success) => ({
    getFeatures: async () => ({
      success: success,
      value: featuresDouble(bigQueryEnabled),
    }),
  });

  it('Validate if loading box is hide from initial form', async () => {
    //Arrange
    const bigQueryEnabled = false;
    const success = true;
    //Act
    render(
      <AppServicesProvider
        forcedServices={{
          bigQueryClient: bigQueryClientDouble(success),
          dopplerUserApiClient: dopplerUserApiClientDouble(bigQueryEnabled, success),
        }}
      >
        <IntlProvider>
          <AuthorizationPage />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('renders big-query free account page', async () => {
    // Arrange
    const bigQueryEnabled = false;
    const success = true;
    const texts = [
      'big_query.free_text_summary',
      'big_query.free_text_strong',
      'big_query.free_ul_item_insights',
      'big_query.free_ul_item_filter',
      'big_query.free_title',
    ];

    //act
    render(
      <AppServicesProvider
        forcedServices={{
          bigQueryClient: bigQueryClientDouble(success),
          dopplerUserApiClient: dopplerUserApiClientDouble(bigQueryEnabled),
        }}
      >
        <IntlProvider>
          <AuthorizationPage />
        </IntlProvider>
      </AppServicesProvider>,
    );

    //assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
    texts.map((text) => expect(screen.getByText(text)).toBeInTheDocument());
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('renders big-query control panel page', async () => {
    //Arrange
    const bigQueryEnabled = true;
    const success = true;

    //act
    render(
      <AppServicesProvider
        forcedServices={{
          bigQueryClient: bigQueryClientDouble(success),
          dopplerUserApiClient: dopplerUserApiClientDouble(bigQueryEnabled, success),
        }}
      >
        <IntlProvider>
          <AuthorizationPage />
        </IntlProvider>
      </AppServicesProvider>,
    );

    //assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.queryByText('big_query.free_title')).not.toBeInTheDocument();
  });

  it('control panel page validate submit', async () => {
    //Arrange
    const bigQueryEnabled = true;
    const success = true;
    const jsdomAlert = window.alert;
    window.alert = () => {};

    //act
    render(
      <AppServicesProvider
        forcedServices={{
          bigQueryClient: bigQueryClientDouble(success),
          dopplerUserApiClient: dopplerUserApiClientDouble(bigQueryEnabled, success),
        }}
      >
        <IntlProvider>
          <AuthorizationPage />
        </IntlProvider>
      </AppServicesProvider>,
    );

    //assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.queryByText('big_query.free_title')).not.toBeInTheDocument();
    // simulate submit form
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    await act(async () => userEvent.click(submitButton));
    window.alert = jsdomAlert;
  });
});
