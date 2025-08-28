import { BrowserRouter } from 'react-router-dom';
import { SuccessAccountCancellation } from '.';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('SuccessAccountCancellation component', () => {
  it('should render component - free users', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <SuccessAccountCancellation isFreeAccount={true} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.cancellation.success_account_cancellation.title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.success_account_cancellation.description'),
    ).toBeInTheDocument();
  });

  it('should render component - paid users', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <SuccessAccountCancellation isFreeAccount={false} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.cancellation.success_account_cancellation.title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.success_account_cancellation.paid_users_description'),
    ).toBeInTheDocument();
  });
});
