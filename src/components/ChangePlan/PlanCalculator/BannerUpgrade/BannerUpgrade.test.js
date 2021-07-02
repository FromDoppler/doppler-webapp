import React from 'react';
import { render, cleanup } from '@testing-library/react';
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
  afterEach(cleanup);

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

      const currentPlanList = [];
      for (let i = 1; i <= 10; i++) {
        currentPlanList.push({ ...currentPlan, id: i });
      }

      // Act
      const { getByText } = render(
        <DependenciesContainer>
          <BannerUpgrade currentPlan={currentPlan} currentPlanList={currentPlanList} />
        </DependenciesContainer>,
      );

      // Assert
      expect(
        getByText(`plan_calculator.banner_for_${planType.replace('-', '_')}`),
      ).toBeInTheDocument();
    });
  });
});
