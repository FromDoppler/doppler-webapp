import { getByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { FirstSteps, mapSystemUsageSummary } from '.';
import '@testing-library/jest-dom/extend-expect';
import { firstStepsFake } from './reducers/firstStepsReducer';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('FirstSteps component', () => {
  it('should render FirstSteps component', async () => {
    // Arrange
    const firstStepsData = mapSystemUsageSummary(firstStepsFake);

    // Act
    render(
      <IntlProvider>
        <FirstSteps />
      </IntlProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader, { timeout: 2500 });

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
