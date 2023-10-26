import { getByText, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PaymentFrequency } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { SUBSCRIPTION_TYPE } from '../../../doppler-types';
import { MemoryRouter as Router } from 'react-router-dom';

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
    const paymentFrequenciesList = FAKE_DISCOUNT_LIST;
    const currentSubscriptionUser = 1;
    const onSelectPaymentFrequency = () => null;

    // Act
    render(
      <Router>
        <IntlProvider>
          <PaymentFrequency
            paymentFrequenciesList={paymentFrequenciesList}
            onSelectPaymentFrequency={onSelectPaymentFrequency}
            currentSubscriptionUser={currentSubscriptionUser}
            disabled={false}
          />
        </IntlProvider>
      </Router>,
    );

    // Assert
    const discountList = screen.getByRole('navigation');
    const listitems = discountList.querySelectorAll('button');
    paymentFrequenciesList.forEach((discount, index) => {
      const discountName = `buy_process.discount_${discount.subscriptionType.replace('-', '_')}`;
      expect(listitems[index]).toHaveTextContent(discountName);
      if (discount.discountPercentage > 0) {
        getByText(
          listitems[index],
          `buy_process.discount_` + discount.subscriptionType.replace('-', '_'),
        );
      }
    });
  });
});
