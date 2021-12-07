import '@testing-library/jest-dom/extend-expect';
import { getByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { CampaignSummary, fakeCampaignsSummary } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { mapCampaignsSummary } from './reducers/campaignSummaryReducer';

describe('CampaignSummary component', () => {
  it('should render CampaignSummary component', async () => {
    // Arrange
    const kpis = mapCampaignsSummary(fakeCampaignsSummary);

    // Act
    render(
      <IntlProvider>
        <CampaignSummary />
      </IntlProvider>,
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
