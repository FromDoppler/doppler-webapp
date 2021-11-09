import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { PlanPriceWithoutDiscounts } from './PlanPriceWithoutDiscounts';
import { PLAN_TYPE, SUBSCRIPTION_TYPE } from '../../../doppler-types';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PlanPriceWithoutDiscounts', () => {
  it('should render price without discount when percentage is greather to 0', () => {
    // Arrange
    const selectedPlan = {
      type: PLAN_TYPE.byContact,
      fee: 30,
    };
    const selectedDiscount = {
      id: 3,
      subscriptionType: SUBSCRIPTION_TYPE.quarterly,
      discountPercentage: 15,
      monthsAmmount: 3,
    };

    // Act
    render(
      <IntlProvider>
        <PlanPriceWithoutDiscounts
          selectedPlan={selectedPlan}
          selectedDiscount={selectedDiscount}
        />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByText(selectedPlan.fee)).toBeInTheDocument();
  });
});
