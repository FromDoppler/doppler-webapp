import { getByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { FirstSteps, mapSystemUsageSummary } from '.';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { fakeSystemUsageSummary } from '../../../services/dashboardService/SystemUsageSummary.double';
import { AppServicesProvider } from '../../../services/pure-di';

const systemUsageSummaryDouble = () => ({
  getSystemUsageSummaryData: async () => ({
    success: true,
    value: fakeSystemUsageSummary,
  }),
});

describe('FirstSteps component', () => {
  it('should render FirstSteps component', async () => {
    // Arrange
    const firstStepsData = mapSystemUsageSummary(fakeSystemUsageSummary);

    // Act
    render(
      <AppServicesProvider forcedServices={{ systemUsageSummary: systemUsageSummaryDouble() }}>
        <IntlProvider>
          <FirstSteps />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader, { timeout: 4500 });

    const firstSteps = firstStepsData.firstSteps;
    const notifications = firstStepsData.notifications;
    const allSteps = screen.getAllByRole('alert', { name: 'step' });
    const allNotifications = screen.getAllByRole('alert', { name: 'notification' });
    firstSteps.forEach((step, index) => {
      const node = allSteps[index];
      expect(getByText(node, step.titleId)).toBeInTheDocument();
    });
    notifications.forEach((notification, index) => {
      const node = allNotifications[index];
      expect(getByText(node, notification.titleId)).toBeInTheDocument();
    });
  });
});
