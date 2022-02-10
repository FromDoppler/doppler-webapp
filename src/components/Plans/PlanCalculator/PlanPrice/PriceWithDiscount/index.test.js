import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { PriceWithDiscount } from '.';
import { PLAN_TYPE, SUBSCRIPTION_TYPE } from '../../../../../doppler-types';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PriceWithDiscount', () => {
  it('should render price with discount when discount percentage is greather to 0', () => {
    // Arrange
    const selectedPlan = {
      type: PLAN_TYPE.byContact,
      fee: 30,
    };
    const selectedDiscount = {
      id: 3,
      subscriptionType: SUBSCRIPTION_TYPE.yearly,
      discountPercentage: 40,
      numberMonths: 12,
    };

    // Act
    render(
      <IntlProvider>
        <PriceWithDiscount selectedPlan={selectedPlan} selectedDiscount={selectedDiscount} />
      </IntlProvider>,
    );

    // Assert
    expect(
      screen.getByText(
        'plan_calculator.with_' + selectedDiscount.subscriptionType.replace('-', '_') + '_discount',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/216/i)).toBeInTheDocument();
  });
});
