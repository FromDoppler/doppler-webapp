import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlanCalculator from './PlanCalculator';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../services/pure-di';
import { MemoryRouter, Route } from 'react-router-dom';

describe('PlanCalculator component', () => {
  afterEach(cleanup);

  const dependencies = {
    appSessionRef: {
      current: {
        userData: {
          user: {
            plan: {},
          },
        },
      },
    },
  };

  const planServiceDoubleBase = {
    getPlanList: () => [],
    mapCurrentPlanFromTypeOrId: () => {},
    getPlanTypes: () => ['prepaid', 'subscribers', 'monthly-deliveries'],
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

  it('should show discount element when selected plan has discounts', async () => {
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
      expect(getByText('US$1,739')).toBeInTheDocument();
      expect(getByText('580')).toBeInTheDocument();
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

  it('should show an error if there is no plan to upgrade', async () => {
    // Arrange
    const planServiceDouble = {
      ...planServiceDoubleBase,
      getPlans: () => [],
    };

    // Act
    const { getByText } = render(<PlanCalculatorElement planServiceDouble={planServiceDouble} />);

    // Assert
    await waitFor(() => {
      expect(getByText('common.unexpected_error')).toBeInTheDocument();
    });
  });
});
