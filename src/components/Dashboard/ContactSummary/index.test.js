import '@testing-library/jest-dom/extend-expect';
import { getByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { ContactSummary } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { mapContactSummary } from '../../../services/contactSummary';
import { AppServicesProvider } from '../../../services/pure-di';
import { fakeContactsSummary } from '../../../services/reports/index.double';

const getContactSummaryServiceDouble = () => ({
  getContactsSummary: async () => ({
    success: true,
    value: mapContactSummary(fakeContactsSummary),
  }),
});

describe('ContactSummary component', () => {
  it('should render ContactSummary component when has info', async () => {
    // Arrange
    const kpis = mapContactSummary(fakeContactsSummary);
    const contactSummaryService = {
      getContactsSummary: async () => ({
        success: true,
        value: mapContactSummary(fakeContactsSummary),
      }),
    };

    // Act
    render(
      <AppServicesProvider forcedServices={{ contactSummaryService }}>
        <IntlProvider>
          <ContactSummary />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    const allKpis = screen.getAllByRole('figure');
    kpis.forEach((kpi, index) => {
      const node = allKpis[index];
      expect(getByText(node, kpi.kpiTitleId)).toBeInTheDocument();
    });
  });

  it('should render ContactSummary component when has not info', async () => {
    // Arrange
    const contactSummaryService = {
      getContactsSummary: async () => ({
        success: true,
        value: mapContactSummary({
          totalSubscribers: 0,
          newSubscribers: 0,
          removedSubscribers: 0,
        }),
      }),
    };

    // Act
    render(
      <AppServicesProvider forcedServices={{ contactSummaryService }}>
        <IntlProvider>
          <ContactSummary />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByText('dashboard.contacts.overlayMessage')).toBeInTheDocument();
  });

  it('should render unexpected error', async () => {
    // Arrange
    const contactSummaryService = {
      getContactsSummary: async () => ({
        success: false,
        error: 'something wrong!',
      }),
    };

    // Act
    render(
      <AppServicesProvider forcedServices={{ contactSummaryService }}>
        <IntlProvider>
          <ContactSummary />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    // because kpis is not visible
    expect(screen.queryByText('dashboard.contacts.overlayMessage')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('figure')).toHaveLength(0);

    // should render unexpected error because the request fail
    screen.getByTestId('unexpected-error');
  });
});
