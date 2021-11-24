import { getByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { FirstSteps } from '.';
import '@testing-library/jest-dom/extend-expect';
import { firstStepsFake, orderItem } from './reducers/firstStepsReducer';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('FirstSteps component', () => {
  it('should render FirstSteps component', async () => {
    // Act
    render(
      <IntlProvider>
        <FirstSteps />
      </IntlProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader, { timeout: 2500 });

    const firstSteps = firstStepsFake.firstSteps.sort(orderItem);
    const notifications = firstStepsFake.notifications.sort(orderItem);
    const allSteps = screen.getAllByRole('alert', { name: 'step' });
    const allNotifications = screen.getAllByRole('alert', { name: 'notification' });
    firstSteps.forEach((step, index) => {
      const node = allSteps[index];
      expect(getByText(node, step.title)).toBeInTheDocument();
    });
    notifications.forEach((notification, index) => {
      const node = allNotifications[index];
      expect(getByText(node, notification.title)).toBeInTheDocument();
    });
  });
});
