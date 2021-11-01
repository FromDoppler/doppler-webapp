import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { BannerUpgrade } from './BannerUpgrade';
import { MemoryRouter as Router } from 'react-router';
import { PLAN_TYPE } from '../../../../doppler-types';

const featuresSets = {
  PREMIUM: 'premium',
};

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

const DependenciesContainer = ({ children }) => (
  <AppServicesProvider forcedServices={dependencies}>
    <IntlProvider>
      <Router>{children}</Router>
    </IntlProvider>
  </AppServicesProvider>
);

describe('BannerUpgrade component', () => {
  it('should not show banner when user is not positioned on the maximum plan for the current feature set', () => {
    // Arrange
    const currentPlan = {
      id: 1,
      type: PLAN_TYPE.byEmail,
      featureSet: featuresSets.PREMIUM,
    };

    const currentPlanList = [];
    for (let i = 1; i < 10; i++) {
      currentPlanList.push({ ...currentPlan, id: i });
    }

    // Act
    render(
      <DependenciesContainer>
        <BannerUpgrade currentPlan={currentPlan} currentPlanList={currentPlanList} />
      </DependenciesContainer>,
    );

    // Assert
    expect(screen.queryByTestId('dp-calc-message')).not.toBeInTheDocument();
  });

  it('should show banner when user is positioned on the maximum plan for the current feature set', () => {
    // Arrange
    const currentPlan = {
      id: 10,
      type: PLAN_TYPE.byEmail,
      featureSet: featuresSets.PREMIUM,
    };

    const currentPlanList = [];
    for (let i = 1; i <= 10; i++) {
      currentPlanList.push({ ...currentPlan, id: i });
    }

    // Act
    render(
      <DependenciesContainer>
        <BannerUpgrade currentPlan={currentPlan} currentPlanList={currentPlanList} />
      </DependenciesContainer>,
    );

    // Assert
    expect(screen.getByTestId('dp-calc-message')).toBeInTheDocument();
  });

  it('should not break if user is positioned on the maximum plan for the current feature set and plan type does not exist', () => {
    // Arrange
    const currentPlan = {
      id: 10,
      type: 'unknown',
      featureSet: featuresSets.PREMIUM,
    };

    const currentPlanList = [];
    for (let i = 1; i <= 10; i++) {
      currentPlanList.push({ ...currentPlan, id: i });
    }

    // Act
    render(
      <DependenciesContainer>
        <BannerUpgrade currentPlan={currentPlan} currentPlanList={currentPlanList} />
      </DependenciesContainer>,
    );

    // Assert
    expect(screen.getByTestId('dp-calc-message')).toBeInTheDocument();
  });

  it(`should show correct text in banner for subscribers plan type when there is no plan to upgrade`, () => {
    // Arrange
    const currentPlan = {
      id: 10,
      type: PLAN_TYPE.byContact,
      featureSet: featuresSets.PREMIUM,
    };

    const sessionPlan = {
      planSubscription: 3,
    };
    const planTypes = [PLAN_TYPE.byContact];

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
          planTypes={planTypes}
        />
      </DependenciesContainer>,
    );

    // Assert
    expect(
      screen.queryByText('plan_calculator.advice_for_subscribers_large_plan'),
    ).toBeInTheDocument();
  });

  describe.each([
    { plan: PLAN_TYPE.byEmail },
    { plan: PLAN_TYPE.byCredit },
    { plan: PLAN_TYPE.byContact },
  ])('Content validation', ({ plan }) => {
    it(`should show correct text in banner for ${plan} plan type`, () => {
      // Arrange
      const currentPlan = {
        id: 10,
        type: plan,
        featureSet: featuresSets.PREMIUM,
      };

      const sessionPlan = {
        planSubscription: 1,
      };

      const planTypes = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail];
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
            planTypes={planTypes}
          />
        </DependenciesContainer>,
      );

      // Assert
      expect(
        screen.queryByText(`plan_calculator.banner_for_${plan.replace('-', '_')}`),
      ).toBeInTheDocument();
    });
  });
});
