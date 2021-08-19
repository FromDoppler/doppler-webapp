import React from 'react';
import { render, waitForElementToBeRemoved, screen, logRoles } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthorizationPage } from './AuthorizationPage';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('test for validate authorization form component ', () => {
  const result = {
    emails: ['email1@gmail.com', 'email2@gmail.com', 'email3@gmail.com'],
  };

  const bigQueryClientDouble = {
    getEmailsData: async () => {
      return { emails: result.emails };
    },
  };

  const featuresDouble = (bigQueryEnabled) => ({
    bigQuery: bigQueryEnabled,
  });

  const dopplerUserApiClientDouble = (bigQueryEnabled) => ({
    getFeatures: async () => ({
      success: true,
      value: featuresDouble(bigQueryEnabled),
    }),
  });

  it('Validate if loading box is hide from initial form', async () => {
    //Act
    render(
      <AppServicesProvider
        forcedServices={{
          bigQueryClient: bigQueryClientDouble,
          dopplerUserApiClient: dopplerUserApiClientDouble(false),
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
          bigQueryClient: bigQueryClientDouble,
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
    // Arrange
    const bigQueryEnabled = true;

    //act
    render(
      <AppServicesProvider
        forcedServices={{
          bigQueryClient: bigQueryClientDouble,
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
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.queryByText('big_query.free_title')).not.toBeInTheDocument();
  });
});
