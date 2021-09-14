import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlanCalculator from './PlanCalculator';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import { MemoryRouter, Route } from 'react-router-dom';
import { orderPlanTypes } from '../../../utils';

describe('PlanCalculator component', () => {
  afterEach(cleanup);

  const dependencies = {
    appSessionRef: {
      current: {
        userData: {
          user: {
            plan: { planSubscription: 1 },
          },
        },
      },
    },
  };

  const planTypes = orderPlanTypes(['prepaid', 'subscribers', 'monthly-deliveries']);
  const planServiceDoubleBase = {
    getPlanList: () => [],
    mapCurrentPlanFromTypeOrId: () => {},
    getPlanTypes: () => planTypes,
    getBuyUrl: () => '',
  };

  const PlanCalculatorElement = ({ planServiceDouble }) => (
    <MemoryRouter initialEntries={['plan-selection/standard']}>
      <Route path="plan-selection/:pathType/:planType?">
        <AppServicesProvider forcedServices={{ ...dependencies, planService: planServiceDouble }}>
          <IntlProvider>
            <PlanCalculator />
          </IntlProvider>
        </AppServicesProvider>
      </Route>
    </MemoryRouter>
  );

  it('should show all plan types in tabs', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 15,
          featureSet: 'standard',
        },
      ],
    };

    // Act
    const { container, getByText } = render(
      <PlanCalculatorElement planServiceDouble={planServiceDouble} />,
    );

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.tab--link')).toBeInTheDocument();
      expect(getByText('plan_calculator.plan_type_prepaid')).toBeInTheDocument();
      expect(getByText('plan_calculator.plan_type_subscribers')).toBeInTheDocument();
      expect(getByText('plan_calculator.plan_type_monthly_deliveries')).toBeInTheDocument();

      // check the order of the plan types
      const navigatorTabs = container.querySelector('.tabs-nav');
      let tab = navigatorTabs.firstChild;
      planTypes.forEach((planType) => {
        expect(tab).toHaveTextContent(`plan_calculator.plan_type_${planType.replace('-', '_')}`);
        tab = tab.nextSibling;
      });
    });
  });

  it('should show message box when reach the max of slider', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 15,
          featureSet: 'standard',
        },
      ],
    };

    // Act
    const { container } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-calc-message')).toBeInTheDocument();
    });
  });

  it('should not show message box when not reach the max of slider', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 15,
          featureSet: 'standard',
        },
        {
          type: 'prepaid',
          id: 2,
          name: '2500-CREDITS',
          credits: 2500,
          price: 35,
          featureSet: 'standard',
        },
      ],
    };

    // Act
    const { container } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-calc-message')).not.toBeInTheDocument();
    });
  });

  it('should show discount message when subscription is quarterly or higher', async () => {
    // Arrange
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 42,
                planSubscription: 6,
              },
            },
          },
        },
      },
    };

    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 15,
          featureSet: 'standard',
          billingCycleDetails: [
            {
              id: 54,
              idPlan: 11,
              paymentType: 'CC',
              discountPercentage: 0,
              billingCycle: 'monthly',
            },
            {
              id: 56,
              idPlan: 11,
              paymentType: 'CC',
              discountPercentage: 5,
              billingCycle: 'quarterly',
            },
            {
              id: 58,
              idPlan: 11,
              paymentType: 'CC',
              discountPercentage: 15,
              billingCycle: 'half-yearly',
            },
            {
              id: 60,
              idPlan: 11,
              paymentType: 'CC',
              discountPercentage: 25,
              billingCycle: 'yearly',
            },
          ],
        },
      ],
    };

    // Act
    const { container, getByText } = render(
      <MemoryRouter initialEntries={['plan-selection/standard']}>
        <Route path="plan-selection/:pathType/:planType?">
          <AppServicesProvider forcedServices={{ ...dependencies, planService: planServiceDouble }}>
            <IntlProvider>
              <PlanCalculator />
            </IntlProvider>
          </AppServicesProvider>
        </Route>
      </MemoryRouter>,
    );

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-wrap-subscription')).not.toBeInTheDocument();
      expect(getByText('plan_calculator.discount_subscription_half_yearly')).toBeInTheDocument();
    });
  });

  it('should show discount element when selected plan has discounts and user has monthly subscription', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 15,
          featureSet: 'standard',
          billingCycleDetails: [
            {
              id: 54,
              idPlan: 11,
              paymentType: 'CC',
              discountPercentage: 0,
              billingCycle: 'monthly',
            },
            {
              id: 56,
              idPlan: 11,
              paymentType: 'CC',
              discountPercentage: 5,
              billingCycle: 'quarterly',
            },
            {
              id: 58,
              idPlan: 11,
              paymentType: 'CC',
              discountPercentage: 15,
              billingCycle: 'half-yearly',
            },
            {
              id: 60,
              idPlan: 11,
              paymentType: 'CC',
              discountPercentage: 25,
              billingCycle: 'yearly',
            },
          ],
        },
      ],
    };

    // Act
    const { container } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-wrap-subscription')).toBeInTheDocument();
    });
  });

  it('should not show discount element when selected plan has not discounts', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 15,
          featureSet: 'standard',
        },
      ],
    };

    // Act
    const { container } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-wrap-subscription')).not.toBeInTheDocument();
    });
  });

  it('should show message when it has a discount applied', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 15,
          featureSet: 'standard',
          billingCycleDetails: [
            {
              id: 56,
              idPlan: 11,
              paymentType: 'CC',
              discountPercentage: 5,
              billingCycle: 'quarterly',
            },
          ],
        },
      ],
    };

    // Act
    const { getByText } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(getByText('plan_calculator.with_quarterly_discount')).toBeInTheDocument();
    });
  });

  it('should not show message when it has not a discount applied', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 15,
          featureSet: 'standard',
        },
      ],
    };

    // Act
    const { queryByText } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(queryByText('plan_calculator.with_quarterly_discount')).toBe(null);
      expect(queryByText('plan_calculator.with_half_yearly_discount')).toBe(null);
      expect(queryByText('plan_calculator.with_yearly_discount')).toBe(null);
    });
  });

  it('should calc price with discount', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 610,
          featureSet: 'standard',
          billingCycleDetails: [
            {
              id: 56,
              idPlan: 11,
              paymentType: 'CC',
              discountPercentage: 5,
              billingCycle: 'quarterly',
            },
          ],
        },
      ],
    };

    // Act
    const { getByText } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(getByText('US$1,738.50')).toBeInTheDocument();
      expect(getByText('579.50')).toBeInTheDocument();
      expect(getByText('610')).toBeInTheDocument();
    });
  });

  it('should show the slider if the user has at least one plan to upgrade', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 15,
          featureSet: 'standard',
        },
      ],
    };

    // Act
    const { container } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.range-slider')).toBeInTheDocument();
    });
  });

  it('should hide the slider and show a suggestion to contact us if there is no plan to upgrade', async () => {
    // Arrange
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 46,
              },
            },
          },
        },
      },
    };

    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'monthly-deliveries',
          id: 46,
          name: '10000000-EMAILS-STANDARD',
          emailsByMonth: 10000000,
          extraEmailPrice: 0.0003,
          fee: 3600,
          featureSet: 'standard',
          features: null,
          billingCycleDetails: null,
        },
      ],
    };

    // Act
    const { container } = render(
      <MemoryRouter initialEntries={['plan-selection/standard']}>
        <Route path="plan-selection/:pathType/:planType?">
          <AppServicesProvider forcedServices={{ ...dependencies, planService: planServiceDouble }}>
            <IntlProvider>
              <PlanCalculator />
            </IntlProvider>
          </AppServicesProvider>
        </Route>
      </MemoryRouter>,
    );

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-message-upgrade-plan')).toBeInTheDocument();
      expect(container.querySelector('.range-slider')).not.toBeInTheDocument();
    });
  });

  it('should show correct amount and amount description for prepaid plan', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'prepaid',
          id: 1,
          name: '1500-CREDITS',
          credits: 1500,
          price: 15,
          featureSet: 'standard',
        },
      ],
    };

    // Act
    const { container } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-calc-quantity h3')).toHaveTextContent('1,500');
      expect(container.querySelector('.dp-cost-per-email')).not.toBeInTheDocument();
      expect(container.querySelector('.dp-calc-quantity h4')).toHaveTextContent(
        'plans.prepaid_amount_description',
      );
    });
  });

  it('should show correct amount and amount description for subscribers plan', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'subscribers',
          id: 1,
          name: '2500-SUBSCRIBERS-STANDARD',
          subscriberLimit: 2500,
          fee: 34,
          featureSet: 'standard',
          featureList: null,
          billingCycleDetails: null,
        },
      ],
    };

    // Act
    const { container } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-calc-quantity h3')).toHaveTextContent('2,500');
      expect(container.querySelector('.dp-cost-per-email')).not.toBeInTheDocument();
      expect(container.querySelector('.dp-calc-quantity h4')).toHaveTextContent(
        'plans.subscribers_amount_description',
      );
    });
  });

  it('should show correct amount and amount description for emails plan', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [
        {
          type: 'monthly-deliveries',
          id: 1,
          name: '5000-EMAILS-STANDARD',
          emailsByMonth: 5000,
          extraEmailPrice: 3.5,
          fee: 50,
          featureSet: 'standard',
          features: null,
          billingCycleDetails: null,
        },
      ],
    };

    // Act
    const { container } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-calc-quantity h3')).toHaveTextContent('5,000');
      expect(container.querySelector('.dp-cost-per-email')).toBeInTheDocument();
      expect(container.querySelector('.dp-calc-quantity h4')).toHaveTextContent(
        'plans.monthly_deliveries_amount_description',
      );
    });
  });
});
