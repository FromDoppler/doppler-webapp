import '@testing-library/jest-dom/extend-expect';
import { getByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { ContactSummary, fakeContactsSummary } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { mapContactSummary } from './reducers/contactSummaryReducer';

describe('ContactSummary component', () => {
  it('should render ContactSummary component', async () => {
    // Arrange
    const kpis = mapContactSummary(fakeContactsSummary);

    // Act
    render(
      <IntlProvider>
        <ContactSummary />
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
