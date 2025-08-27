import { BrowserRouter } from 'react-router-dom';
import { SuccessScheduledCancellation } from '.';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('SuccessScheduledCancellation component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <SuccessScheduledCancellation />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.cancellation.success_scheduled_cancellation.title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.success_scheduled_cancellation.description'),
    ).toBeInTheDocument();
  });
});
