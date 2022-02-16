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
    const promotion = {
      isValid: false,
    };
    const loadingPromocode = false;

    // Act
    render(
      <IntlProvider>
        <PlanPrice
          selectedPlan={selectedPlan}
          selectedDiscount={selectedDiscount}
          promotion={promotion}
          loadingPromocode={loadingPromocode}
        />
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
    const promotion = {
      isValid: false,
    };
    const loadingPromocode = false;

    // Act
    render(
      <IntlProvider>
        <PlanPrice
          selectedPlan={selectedPlan}
          selectedDiscount={selectedDiscount}
          promotion={promotion}
          loadingPromocode={loadingPromocode}
        />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByText('plan_calculator.discount_clarification_prepaid')).toBeInTheDocument();
    expect(screen.queryByText('plan_calculator.discount_clarification')).not.toBeInTheDocument();
  });

  it('should apply promocode when promotion is valid', () => {
    // Arrange
    const selectedPlan = {
      type: PLAN_TYPE.byCredit,
      price: 30,
    };
    const selectedDiscount = {
      id: 3,
      subscriptionType: SUBSCRIPTION_TYPE.yearly,
      discountPercentage: 40,
      monthsAmmount: 12,
    };
    const promotion = {
      isValid: true,
      discountPercentage: 20,
    };
    const loadingPromocode = false;
    const planFeeWithDiscount = 24; // because should apply promocode

    // Act
    render(
      <IntlProvider>
        <PlanPrice
          selectedPlan={selectedPlan}
          selectedDiscount={selectedDiscount}
          promotion={promotion}
          loadingPromocode={loadingPromocode}
        />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByTestId('old-price')).toBeInTheDocument();
    const priceWithDiscount = screen.getByTestId('dp-price-amount');
    expect(priceWithDiscount).toBeInTheDocument();
    expect(priceWithDiscount).toHaveTextContent(planFeeWithDiscount);
  });

  it('should show warning message when promocode is invalid and there is not selected discount', () => {
    // Arrange
    const selectedPlan = {
      type: PLAN_TYPE.byCredit,
      price: 30,
    };
    const selectedDiscount = null;
    const promotion = {
      isValid: false,
    };
    const loadingPromocode = false;

    // Act
    render(
      <IntlProvider>
        <PlanPrice
          selectedPlan={selectedPlan}
          selectedDiscount={selectedDiscount}
          promotion={promotion}
          loadingPromocode={loadingPromocode}
        />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByTestId('old-price')).not.toBeInTheDocument();
    const priceWithDiscount = screen.getByTestId('dp-price-amount');
    expect(priceWithDiscount).toBeInTheDocument();
    // don't apply discount & promocode
    expect(priceWithDiscount).toHaveTextContent(selectedPlan.price);
    expect(
      screen.getByText('checkoutProcessForm.purchase_summary.promocode_error_message'),
    ).toBeInTheDocument();
  });

  it('should show warning message when promocode is invalid and there is selected discount', () => {
    // Arrange
    const selectedPlan = {
      type: PLAN_TYPE.byCredit,
      price: 30,
    };
    const selectedDiscount = {
      id: 3,
      subscriptionType: SUBSCRIPTION_TYPE.yearly,
      discountPercentage: 40,
      monthsAmmount: 12,
    };
    const promotion = {
      isValid: false,
    };
    const loadingPromocode = false;
    const planFeeWithDiscount = 18; // because should apply selected discount

    // Act
    render(
      <IntlProvider>
        <PlanPrice
          selectedPlan={selectedPlan}
          selectedDiscount={selectedDiscount}
          promotion={promotion}
          loadingPromocode={loadingPromocode}
        />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByTestId('old-price')).toBeInTheDocument();
    expect(screen.queryByTestId('old-price')).toHaveTextContent(selectedPlan.price);
    const priceWithDiscount = screen.getByTestId('dp-price-amount');
    expect(priceWithDiscount).toBeInTheDocument();
    // don't apply discount & promocode
    expect(priceWithDiscount).toHaveTextContent(planFeeWithDiscount);
    expect(
      screen.getByText('checkoutProcessForm.purchase_summary.promocode_error_message'),
    ).toBeInTheDocument();
  });

  it('should return empty component when there is no selected plan ', () => {
    // Arrange
    const selectedPlan = null;
    const selectedDiscount = null;
    const promotion = {
      isValid: false,
    };
    const loadingPromocode = false;

    // Act
    render(
      <IntlProvider>
        <PlanPrice
          selectedPlan={selectedPlan}
          selectedDiscount={selectedDiscount}
          promotion={promotion}
          loadingPromocode={loadingPromocode}
        />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByText('plan_calculator.discount_clarification')).not.toBeInTheDocument();
    expect(
      screen.queryByText('plan_calculator.discount_clarification_prepaid'),
    ).not.toBeInTheDocument();
  });
});
