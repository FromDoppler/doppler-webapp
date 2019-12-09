import React from 'react';
import { render, cleanup, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import SubscriberHistorySentCampaigns from './SubscriberHistorySentCampaigns';
import { AppServicesProvider } from '../../../../../services/pure-di';

describe('SubscriberHistorySentCampaigns component', () => {
  afterEach(cleanup);

  const campaignDeliveryCollection = {
    items: [
      {
        campaignId: 1,
        campaignName: 'Campaña estacional de primavera',
        campaignSubject: '¿Como sacarle provecho a la primavera?',
        deliveryStatus: 'opened',
        clicksCount: 2,
      },
    ],
    currentPage: 0,
    itemsCount: 1,
    pagesCount: 1,
  };

  it('should show subscriber campaigns deliveries', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };
    const subscriber = {
      email: 'test@test.com',
    };
    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberHistorySentCampaigns subscriber={subscriber} />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await wait(() =>
      expect(getByText('¿Como sacarle provecho a la primavera?')).toBeInTheDocument(),
    );
  });

  it('should show error message', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriberSentCampaigns: async () => {
        return { success: false };
      },
    };
    const subscriber = {
      email: 'test@test.com',
    };
    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberHistorySentCampaigns subscriber={subscriber} />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await wait(() => expect(getByText('trafficSources.error')).toBeInTheDocument());
  });

  it('should show subscriber firstName', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };
    const subscriber = {
      email: 'test@test.com',
      firstName: { value: 'Manuel' },
    };
    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberHistorySentCampaigns subscriber={subscriber} />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await wait(() => expect(getByText('Manuel')).toBeInTheDocument());
  });
});
