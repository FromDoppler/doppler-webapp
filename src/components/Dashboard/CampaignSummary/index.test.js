import '@testing-library/jest-dom/extend-expect';
import { getByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { CampaignSummary } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { fakeCampaignsSummary } from '../../../services/reports/index.double';
import { AppServicesProvider } from '../../../services/pure-di';
import { mapCampaignsSummary } from '../../../services/campaignSummary';

describe('CampaignSummary component', () => {
  it('should render CampaignSummary component when has info', async () => {
    // Arrange
    const kpis = mapCampaignsSummary(fakeCampaignsSummary);
    const campaignSummaryService = {
      getCampaignsSummary: async () => ({
        success: true,
        value: mapCampaignsSummary(fakeCampaignsSummary),
      }),
    };

    // Act
    render(
      <AppServicesProvider forcedServices={{ campaignSummaryService }}>
        <IntlProvider>
          <CampaignSummary />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader, { timeout: 4500 });

    const allKpis = screen.getAllByRole('figure');
    kpis.forEach((kpi, index) => {
      const node = allKpis[index];
      expect(getByText(node, kpi.kpiTitleId)).toBeInTheDocument();
    });
  });

  it('should render CampaignSummary component when has not info', async () => {
    // Arrange
    const campaignSummaryService = {
      getCampaignsSummary: async () => ({
        success: true,
        value: mapCampaignsSummary({
          totalSentEmails: 0,
          totalOpenClicks: 0,
          clickThroughRate: 0,
        }),
      }),
    };

    // Act
    render(
      <AppServicesProvider forcedServices={{ campaignSummaryService }}>
        <IntlProvider>
          <CampaignSummary />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader, { timeout: 4500 });

    expect(screen.getByText('dashboard.campaigns.overlayMessage')).toBeInTheDocument();
  });

  it('should render unexpected error', async () => {
    // Arrange
    const campaignSummaryService = {
      getCampaignsSummary: async () => ({
        success: false,
        error: 'something wrong!',
      }),
    };

    // Act
    render(
      <AppServicesProvider forcedServices={{ campaignSummaryService }}>
        <IntlProvider>
          <CampaignSummary />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    // because kpis is not visible
    expect(screen.queryByText('dashboard.campaigns.overlayMessage')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('figure')).toHaveLength(0);

    // should render unexpected error because the request fail
    screen.getByTestId('unexpected-error');
  });
});
