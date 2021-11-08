import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Discounts } from '.';
import { SUBSCRIPTION_TYPE } from '../../../../doppler-types';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

export const FAKE_DISCOUNT_LIST = [
  {
    id: 1,
    subscriptionType: SUBSCRIPTION_TYPE.monthly,
    discountPercentage: 0,
  },
  {
    id: 2,
    subscriptionType: SUBSCRIPTION_TYPE.quarterly,
    discountPercentage: 10,
  },
  {
    id: 3,
    subscriptionType: SUBSCRIPTION_TYPE.biyearly,
    discountPercentage: 25,
  },
  {
    id: 4,
    subscriptionType: SUBSCRIPTION_TYPE.yearly,
    discountPercentage: 40,
  },
];

describe('Discount component', () => {
  it('should render Discounts', () => {
    // Arrange
    const selectedDiscount = null;
    const handleChange = () => null;

    // Act
    render(
      <IntlProvider>
        <Discounts
          discounts={FAKE_DISCOUNT_LIST}
          selectedDiscount={selectedDiscount}
          onSelectDiscount={handleChange}
        />
      </IntlProvider>,
    );

    // Assert
    const discountList = screen.getByRole('list', { name: 'discounts' });
    const listitems = discountList.querySelectorAll('li');
    FAKE_DISCOUNT_LIST.forEach((discount, index) => {
      const discountName = `plan_calculator.discount_${discount.subscriptionType.replace(
        '-',
        '_',
      )}`;
      expect(listitems[index]).toHaveTextContent(discountName);
      const discountButton = screen.getByRole('button', { name: discountName });
      expect(discountButton).not.toHaveClass('btn-active');
      if (discount.discountPercentage > 0) {
        expect(listitems[index]).toHaveTextContent(`${discount.discountPercentage}% OFF`);
      }
    });
  });

  it('should render Discounts with a selected discount', () => {
    // Arrange
    const selectedDiscount = FAKE_DISCOUNT_LIST[0];
    const handleChange = () => null;

    // Act
    render(
      <IntlProvider>
        <Discounts
          discounts={FAKE_DISCOUNT_LIST}
          selectedDiscount={selectedDiscount}
          onSelectDiscount={handleChange}
        />
      </IntlProvider>,
    );

    // Assert
    const discountName = `plan_calculator.discount_${selectedDiscount.subscriptionType.replace(
      '-',
      '_',
    )}`;

    const selectedDiscountButton = screen.getByRole('button', { name: discountName });
    expect(selectedDiscountButton).toBeInTheDocument();
    expect(selectedDiscountButton).toHaveClass('btn-active');
  });

  it('should call onSelectDiscount with selected discount', () => {
    // Arrange
    const selectedDiscount = null;
    const handleChange = jest.fn();

    // Act
    render(
      <IntlProvider>
        <Discounts
          discounts={FAKE_DISCOUNT_LIST}
          selectedDiscount={selectedDiscount}
          onSelectDiscount={handleChange}
        />
      </IntlProvider>,
    );

    // Assert
    let selectedDiscountButton;
    const getDiscountName = (subscriptionType) =>
      `plan_calculator.discount_${subscriptionType.replace('-', '_')}`;
    const getButtonByDiscount = (discount) =>
      screen.getByRole('button', {
        name: getDiscountName(discount.subscriptionType),
      });

    expect(handleChange).not.toHaveBeenCalled();

    // simulates that the 10% discount is selected
    selectedDiscountButton = getButtonByDiscount(FAKE_DISCOUNT_LIST[1]);
    userEvent.click(selectedDiscountButton);
    expect(handleChange).toHaveBeenCalledWith(FAKE_DISCOUNT_LIST[1]);

    // simulates that the 25% discount is selected
    selectedDiscountButton = getButtonByDiscount(FAKE_DISCOUNT_LIST[2]);
    userEvent.click(selectedDiscountButton);
    expect(handleChange).toHaveBeenCalledWith(FAKE_DISCOUNT_LIST[2]);
  });
});
