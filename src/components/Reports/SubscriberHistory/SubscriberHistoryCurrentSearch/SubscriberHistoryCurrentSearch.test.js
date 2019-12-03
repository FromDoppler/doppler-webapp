import React from 'react';
import { render, cleanup, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import SubscriberHistoryCurrentSearch from './SubscriberHistoryCurrentSearch';
import { AppServicesProvider } from '../../../../services/pure-di';

const subscriber = {
  email: 'test@test.com',
  fields: [
    {
      name: 'test',
      value: 'test',
      predefined: true,
      private: true,
      readonly: true,
      type: 'boolean',
    },
  ],
  unsubscribedDate: '2019-11-27T18:05:40.847Z',
  unsubscriptionType: 'hardBounce',
  manualUnsubscriptionReason: 'administrative',
  unsubscriptionComment: 'test',
  status: 'active',
  score: 0,
};

describe('SubscriberHistoryCurrentSearch component', () => {
  afterEach(cleanup);

  it('should show subscriber data', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: true, value: subscriber };
      },
    };
    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberHistoryCurrentSearch />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await wait(() => expect(getByText('test@test.com')).toBeInTheDocument());
  });

  it('should show error message', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: false };
      },
    };
    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberHistoryCurrentSearch />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await wait(() => expect(getByText('trafficSources.error')).toBeInTheDocument());
  });
});
