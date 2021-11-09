import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { PlanPrice } from '.';
import { PLAN_TYPE, SUBSCRIPTION_TYPE } from '../../../../doppler-types';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PlanPrice', () => {
  it('should render auto renovation message', () => {
    // Arrange
    const selectedPlan = {
      type: PLAN_TYPE.byContact,
      fee: 30,
    };
    const selectedDiscount = {
      id: 3,
      subscriptionType: SUBSCRIPTION_TYPE.yearly,
      discountPercentage: 40,
      monthsAmmount: 12,
    };

    // Act
    render(
      <IntlProvider>
        <PlanPrice selectedPlan={selectedPlan} selectedDiscount={selectedDiscount} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByText('plan_calculator.discount_clarification')).toBeInTheDocument();
    expect(
      screen.queryByText('plan_calculator.discount_clarification_prepaid'),
    ).not.toBeInTheDocument();
  });

  it('should not render auto renovation message', () => {
    // Arrange
    const selectedPlan = {
      type: PLAN_TYPE.byCredit,
      fee: 30,
    };
    const selectedDiscount = {
      id: 3,
      subscriptionType: SUBSCRIPTION_TYPE.yearly,
      discountPercentage: 40,
      monthsAmmount: 12,
    };

    // Act
    render(
      <IntlProvider>
        <PlanPrice selectedPlan={selectedPlan} selectedDiscount={selectedDiscount} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByText('plan_calculator.discount_clarification_prepaid')).toBeInTheDocument();
    expect(screen.queryByText('plan_calculator.discount_clarification')).not.toBeInTheDocument();
  });
});
