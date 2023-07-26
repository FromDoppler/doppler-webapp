import { getByRole, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PaymentFrequency from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { SUBSCRIPTION_TYPE } from '../../../doppler-types';

export const FAKE_DISCOUNT_LIST = [
  {
    id: 1,
    subscriptionType: SUBSCRIPTION_TYPE.monthly,
    discountPercentage: 0,
    numberMonths: 1,
  },
  {
    id: 2,
    subscriptionType: SUBSCRIPTION_TYPE.quarterly,
    discountPercentage: 10,
    numberMonths: 3,
  },
  {
    id: 3,
    subscriptionType: SUBSCRIPTION_TYPE.biyearly,
    discountPercentage: 25,
    numberMonths: 6,
  },
  {
    id: 4,
    subscriptionType: SUBSCRIPTION_TYPE.yearly,
    discountPercentage: 40,
    numberMonths: 12,
  },
];

describe('PaymentFrequency component', () => {
  it('should render PaymentFrequency component', async () => {
    // Arrange
    const discounts = FAKE_DISCOUNT_LIST;
    const selectedDiscount = null;
    const onSelectDiscount = () => null;

    // Act
    render(
      <IntlProvider>
        <PaymentFrequency
          discounts={discounts}
          selectedDiscount={selectedDiscount}
          onSelectDiscount={onSelectDiscount}
          disabled={false}
        />
      </IntlProvider>,
    );

    // Assert
    const discountList = screen.getByRole('list');
    const listitems = discountList.querySelectorAll('li');
    discounts.forEach((discount, index) => {
      const discountName = `buy_process.discount_${discount.subscriptionType.replace('-', '_')}`;
      expect(listitems[index]).toHaveTextContent(discountName);
      if (discount.discountPercentage > 0) {
        expect(listitems[index]).toHaveTextContent(`buy_process.discount_percentage`);
      }
    });
  });

  it('should render PaymentFrequency component when is disabled', async () => {
    // Arrange
    const discounts = FAKE_DISCOUNT_LIST;
    const selectedDiscount = null;
    const onSelectDiscount = () => null;

    // Act
    render(
      <IntlProvider>
        <PaymentFrequency
          discounts={discounts}
          selectedDiscount={selectedDiscount}
          onSelectDiscount={onSelectDiscount}
          disabled={true}
        />
      </IntlProvider>,
    );

    // Assert
    const discountList = screen.getByRole('list');
    const listitems = discountList.querySelectorAll('li');
    discounts.forEach((discount, index) => {
      const radio = getByRole(listitems[index], 'radio');
      if (discount.numberMonths > 1) {
        expect(radio).toBeDisabled();
      } else {
        expect(radio).not.toBeDisabled();
      }
    });
  });
});
