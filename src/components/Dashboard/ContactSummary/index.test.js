import '@testing-library/jest-dom/extend-expect';
import { getByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { ContactSummary } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { mapContactSummary } from '../../../services/contactSummary';
import { fakeContactsSummary } from '../../../services/reports/index.double';
import { AppServicesProvider } from '../../../services/pure-di';

const getContactSummaryServiceDouble = () => ({
  getContactsSummary: async () => ({
    success: true,
    value: mapContactSummary(fakeContactsSummary),
  }),
});

describe('ContactSummary component', () => {
  it('should render ContactSummary component', async () => {
    // Arrange
    const kpis = mapContactSummary(fakeContactsSummary);

    // Act
    render(
      <AppServicesProvider
        forcedServices={{ contactSummaryService: getContactSummaryServiceDouble() }}
      >
        <IntlProvider>
          <ContactSummary />
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
