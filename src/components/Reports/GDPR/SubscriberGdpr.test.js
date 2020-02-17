import React from 'react';
import { render, cleanup, waitForDomChange } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import SubscriberGdpr from './SubscriberGdpr';
import { AppServicesProvider } from '../../../services/pure-di';

describe('SubscriberGdpr report component', () => {
  const subscriber = {
    email: 'test@test.com',
    fields: [
      {
        name: 'FIRSTNAME',
        value: 'Manuel',
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

  const dopplerApiClientDouble = {
    getSubscriberSentCampaigns: async () => {
      return { success: true, value: campaignDeliveryCollection };
    },
    getSubscriber: async () => {
      return { success: true, value: subscriber };
    },
  };

  afterEach(cleanup);

  it('renders subscriber gdpr report without error', () => {
    // Arrange
    // Act
    render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
  });

  it('renders subscriber gdpr intenationalized title', async () => {
    // Arrange
    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );
    await waitForDomChange();
    // Assert
    expect(getByText('subscriber_gdpr.header_title')).toBeInTheDocument();
  });

  it('component should have a page title defined', async () => {
    // Arrange
    // Act
    render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );
    await waitForDomChange();

    //Assert
    expect(document.title).toEqual('subscriber_gdpr.page_title');
  });

  it('should show subscriber email', async () => {
    // Arrange

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );

    await waitForDomChange();
    // Assert
    expect(getByText(subscriber.email)).toBeInTheDocument();
  });
});
