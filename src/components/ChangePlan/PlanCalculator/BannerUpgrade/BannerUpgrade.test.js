import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BannerUpgrade } from './BannerUpgrade';
import { MemoryRouter as Router } from 'react-router';

const types = {
  MONTHLY_DELIVERIES: 'monthly-deliveries',
  PREPAID: 'prepaid',
  SUSCRIBERS: 'subscribers',
};

const featuresSets = {
  STANDARD: 'standard',
  PLUS: 'plus',
};

const DependenciesContainer = ({ children }) => (
  <IntlProvider>
    <Router>{children}</Router>
  </IntlProvider>
);

describe('BannerUpgrade component', () => {
  it('should not show banner when user is not positioned on the maximum plan for the current feature set', () => {
    // Arrange
    const currentPlan = {
      id: 1,
      type: types.MONTHLY_DELIVERIES,
      featureSet: featuresSets.STANDARD,
    };

    const currentPlanList = [];
    for (let i = 1; i < 10; i++) {
      currentPlanList.push({ ...currentPlan, id: i });
    }

    // Act
    const { container } = render(
      <DependenciesContainer>
        <BannerUpgrade currentPlan={currentPlan} currentPlanList={currentPlanList} />
      </DependenciesContainer>,
    );

    // Assert
    expect(container.querySelector('.dp-calc-message')).not.toBeInTheDocument();
  });

  it('should show banner when user is positioned on the maximum plan for the current feature set', () => {
    // Arrange
    const currentPlan = {
      id: 10,
      type: types.MONTHLY_DELIVERIES,
      featureSet: featuresSets.STANDARD,
    };

    const currentPlanList = [];
    for (let i = 1; i <= 10; i++) {
      currentPlanList.push({ ...currentPlan, id: i });
    }

    // Act
    const { container } = render(
      <DependenciesContainer>
        <BannerUpgrade currentPlan={currentPlan} currentPlanList={currentPlanList} />
      </DependenciesContainer>,
    );

    // Assert
    expect(container.querySelector('.dp-calc-message')).toBeInTheDocument();
  });

  it('should not break if user is positioned on the maximum plan for the current feature set and plan type does not exist', () => {
    // Arrange
    const currentPlan = {
      id: 10,
      type: 'unknown',
      featureSet: featuresSets.STANDARD,
    };

    const currentPlanList = [];
    for (let i = 1; i <= 10; i++) {
      currentPlanList.push({ ...currentPlan, id: i });
    }

    // Act
    const { container } = render(
      <DependenciesContainer>
        <BannerUpgrade currentPlan={currentPlan} currentPlanList={currentPlanList} />
      </DependenciesContainer>,
    );

    // Assert
    expect(container.querySelector('.dp-calc-message')).toBeInTheDocument();
  });

  it(`should show correct text in banner for subscribers plan type when there is no plan to upgrade`, () => {
    // Arrange
    const currentPlan = {
      id: 10,
      type: 'subscribers',
      featureSet: featuresSets.STANDARD,
    };

    const sessionPlan = {
      planSubscription: 3,
    };
    const potencialUpgradePlans = ['subscribers'];

    const currentPlanList = [];
    for (let i = 1; i <= 10; i++) {
      currentPlanList.push({ ...currentPlan, id: i });
    }

    // Act
    render(
      <DependenciesContainer>
        <BannerUpgrade
          sessionPlan={sessionPlan}
          currentPlan={currentPlan}
          currentPlanList={currentPlanList}
          potencialUpgradePlans={potencialUpgradePlans}
        />
      </DependenciesContainer>,
    );

    // Assert
    expect(
      screen.queryByText('plan_calculator.advice_for_subscribers_large_plan'),
    ).toBeInTheDocument();
  });

  describe.each([
    { planType: types.MONTHLY_DELIVERIES },
    { planType: types.PREPAID },
    { planType: types.SUSCRIBERS },
  ])('Content validation', ({ planType }) => {
    it(`should show correct text in banner for ${planType} plan type`, () => {
      // Arrange
      const currentPlan = {
        id: 10,
        type: planType,
        featureSet: featuresSets.STANDARD,
      };

      const sessionPlan = {
        planSubscription: 1,
      };

      const potencialUpgradePlans = ['subscribers', 'monthly-deliveries'];
      const currentPlanList = [];
      for (let i = 1; i <= 10; i++) {
        currentPlanList.push({ ...currentPlan, id: i });
      }

      // Act
      const { getByText } = render(
        <DependenciesContainer>
          <BannerUpgrade
            sessionPlan={sessionPlan}
            currentPlan={currentPlan}
            currentPlanList={currentPlanList}
            potencialUpgradePlans={potencialUpgradePlans}
          />
        </DependenciesContainer>,
      );

      // Assert
      expect(
        getByText(`plan_calculator.banner_for_${planType.replace('-', '_')}`),
      ).toBeInTheDocument();
    });
  });
});
