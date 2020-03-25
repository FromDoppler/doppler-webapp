import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import ReportsPartialsCampaigns from './ReportsPartialsCampaigns';

describe('ReportsPartialsCampaigns component', () => {
  afterEach(cleanup);

  it('should show the error message', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getCampaignNameAndSubject: async () => {
        return { success: false };
      },
      getCampaignSummaryResults: async () => {
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
          <ReportsPartialsCampaigns />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await waitFor(() => expect(getByText('common.unexpected_error')).toBeInTheDocument());
  });

  it('should show feature not available message', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getCampaignNameAndSubject: async () => {
        return { success: true, value: { name: 'test', subject: 'test' } };
      },
      getCampaignSummaryResults: async () => {
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
          <ReportsPartialsCampaigns />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await waitFor(() => expect(getByText('common.feature_no_available')).toBeInTheDocument());
  });

  it('should show data', async () => {
    // Arrange
    const campaignSummaryResults = {
      totalRecipients: 500,
      successFullDeliveries: 20,
      timesForwarded: 0,
      totalTimesOpened: 2,
      lastOpenDate: '2019-11-27T18:05:40.847Z',
      uniqueClicks: 3,
      uniqueOpens: 3,
      totalUnopened: 24,
      totalHardBounces: 2,
      totalSoftBounces: 3,
      totalClicks: 2,
      lastClickDate: '2019-11-27T18:05:40.847Z',
      totalUnsubscribers: 5,
      campaignStatus: 'shipping',
      totalShipped: 50,
    };
    const dopplerApiClientDouble = {
      getCampaignNameAndSubject: async () => {
        return { success: true, value: { name: 'campaign name', subject: 'campaign subject' } };
      },
      getCampaignSummaryResults: async () => {
        return { success: true, value: campaignSummaryResults };
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
          <ReportsPartialsCampaigns />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await waitFor(() => {
      expect(getByText('campaign name')).toBeInTheDocument();
      expect(getByText('campaign subject')).toBeInTheDocument();
      expect(getByText('reports_partials_campaigns.header_title')).toBeInTheDocument();
      expect(getByText('shipping')).toBeInTheDocument();
    });
  });
});
