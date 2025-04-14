import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { PlanInformation } from '.';

describe('Push Notification - PlanInformation', () => {
  it('should render PlanInformation', async () => {
    // Act
    render(
      <IntlProvider>
        <PlanInformation />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('push_notification_selection.push_notification_plan_info.section_1.title');
  });
});
