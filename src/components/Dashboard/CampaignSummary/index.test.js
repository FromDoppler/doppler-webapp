import '@testing-library/jest-dom/extend-expect';
import { getByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { CampaignSummary } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { fakeCampaignsSummary } from '../../../services/reports/index.double';
import { AppServicesProvider } from '../../../services/pure-di';
import { mapCampaignsSummary } from '../../../services/campaignSummary';

const reportClientDouble = () => ({
  getCampaignsSummary: async () => ({
    success: true,
    value: fakeCampaignsSummary,
  }),
});

describe('CampaignSummary component', () => {
  it('should render CampaignSummary component', async () => {
    // Arrange
    const kpis = mapCampaignsSummary(fakeCampaignsSummary);

    // Act
    render(
      <AppServicesProvider forcedServices={{ reportClient: reportClientDouble() }}>
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
});
