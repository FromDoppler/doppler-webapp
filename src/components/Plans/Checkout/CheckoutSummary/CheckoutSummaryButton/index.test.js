import { render, screen } from '@testing-library/react';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import '@testing-library/jest-dom/extend-expect';
import { paymentType } from '../../PaymentMethod/PaymentMethod';
import { CheckoutSummaryButton } from '.';

const CheckoutSummaryButtonElement = ({ paymentMethod, discountByPromocode }) => {
  return (
    <IntlProvider>
      <CheckoutSummaryButton
        paymentMethod={paymentMethod}
        discountByPromocode={discountByPromocode}
      />
    </IntlProvider>
  );
};

describe('CheckoutSummaryButton component', () => {
  it('should show new plan button when the payment method is "credit card"', async () => {
    // Ac
    render(<CheckoutSummaryButtonElement paymentMethod={paymentType.creditCard} />);

    // Assert
    expect(
      screen.getByText(`checkoutProcessSuccess.start_using_new_plan_button`),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_explore_message`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_explore_button`),
    ).not.toBeInTheDocument();
  });

  it('should show new plan button when the payment method is "transfer" and discountByPromocode is 100', async () => {
    // Ac
    render(
      <CheckoutSummaryButtonElement
        paymentMethod={paymentType.transfer}
        discountByPromocode="100"
      />,
    );

    // Assert
    expect(
      screen.getByText(`checkoutProcessSuccess.start_using_new_plan_button`),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_explore_message`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_explore_button`),
    ).not.toBeInTheDocument();
  });

  it('should show new explore section when the payment method is "transfer" and discountByPromocode is different to 100', async () => {
    // Ac
    render(
      <CheckoutSummaryButtonElement
        paymentMethod={paymentType.transfer}
        discountByPromocode="50"
      />,
    );

    // Assert
    expect(
      screen.queryByText(`checkoutProcessSuccess.start_using_new_plan_button`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_explore_message`),
    ).toBeInTheDocument();
    expect(screen.getByText(`checkoutProcessSuccess.transfer_explore_button`)).toBeInTheDocument();
  });
});
