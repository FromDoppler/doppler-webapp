import { BrowserRouter } from 'react-router-dom';
import { EmailMarketingPlan } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';

describe('EmailMarketingPlan component', () => {
  it('should render component - free email marketing', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'free',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 1,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <EmailMarketingPlan plan={plan} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.plan_type_free_label'),
    ).toBeInTheDocument();
  });

  it('should render component - contacts email marketing', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'subscribers',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 1,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <EmailMarketingPlan plan={plan} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.plan_type_subscribers_label'),
    ).toBeInTheDocument();
  });

  it('should render component - emails email marketing', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'monthly_deliveries',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 1,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <EmailMarketingPlan plan={plan} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.plan_type_monthly_deliveries_label'),
    ).toBeInTheDocument();
  });

  it('should render component - credits email marketing', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'prepaid',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 1,
    };

    const user = {
      isCancellationRequested: false
    }

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <EmailMarketingPlan plan={plan} user={user} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.plan_type_prepaid_label'),
    ).toBeInTheDocument();
  });

  it('should render component - contacts email marketing by montly frequency', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'subscribers',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 1,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <EmailMarketingPlan plan={plan} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.plan_type_subscribers_label'),
    ).toBeInTheDocument();
    expect(screen.getByText('my_plan.subscription_details.billing.type_1')).toBeInTheDocument();
  });

  it('should render component - contacts email marketing by quarterly frequency', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'subscribers',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 3,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <EmailMarketingPlan plan={plan} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.plan_type_subscribers_label'),
    ).toBeInTheDocument();
    expect(screen.getByText('my_plan.subscription_details.billing.type_3')).toBeInTheDocument();
  });

  it('should render component - contacts email marketing by semiannual frequency', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'subscribers',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 6,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <EmailMarketingPlan plan={plan} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.plan_type_subscribers_label'),
    ).toBeInTheDocument();
    expect(screen.getByText('my_plan.subscription_details.billing.type_6')).toBeInTheDocument();
  });

  it('should render component - contacts email marketing by annual frequency', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'subscribers',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 12,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <EmailMarketingPlan plan={plan} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.plan_type_subscribers_label'),
    ).toBeInTheDocument();
    expect(screen.getByText('my_plan.subscription_details.billing.type_12')).toBeInTheDocument();
  });
});
