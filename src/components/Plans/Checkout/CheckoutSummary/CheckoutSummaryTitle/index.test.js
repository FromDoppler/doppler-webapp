import { render, screen } from '@testing-library/react';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import '@testing-library/jest-dom/extend-expect';
import { paymentType } from '../../PaymentMethod/PaymentMethod';
import { CheckoutSummaryTitle } from '.';

const CheckoutSummaryTitleElement = ({ paymentMethod, upgradePending }) => {
  return (
    <IntlProvider>
      <CheckoutSummaryTitle paymentMethod={paymentMethod} upgradePending={upgradePending} />
    </IntlProvider>
  );
};

describe('CheckoutSummaryTitle component', () => {
  it('should show the purchase finished when the payment method is "credit card"', async () => {
    // Act
    render(<CheckoutSummaryTitleElement paymentMethod={paymentType.creditCard} />);

    // Assert
    expect(screen.getByText(`checkoutProcessSuccess.purchase_finished_title`)).toBeInTheDocument();
    expect(screen.getByText(`checkoutProcessSuccess.title`)).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_purchase_finished_title`),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(`checkoutProcessSuccess.transfer_title`)).not.toBeInTheDocument();
  });

  it('should show the purchase finished when the payment method is "transfer" and not upgrade pending', async () => {
    // Act
    render(
      <CheckoutSummaryTitleElement paymentMethod={paymentType.transfer} upgradePending={false} />,
    );

    // Assert
    expect(screen.getByText(`checkoutProcessSuccess.purchase_finished_title`)).toBeInTheDocument();
    expect(screen.getByText(`checkoutProcessSuccess.title`)).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_purchase_finished_title`),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(`checkoutProcessSuccess.transfer_title`)).not.toBeInTheDocument();
  });

  it('should show purchase in process when the payment method is "transfer" and upgrade pending', async () => {
    // Act
    render(
      <CheckoutSummaryTitleElement paymentMethod={paymentType.transfer} upgradePending={true} />,
    );

    // Assert
    expect(
      screen.getByText(`checkoutProcessSuccess.transfer_purchase_finished_title`),
    ).toBeInTheDocument();
    expect(screen.getByText(`checkoutProcessSuccess.transfer_title`)).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.purchase_finished_title`),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(`checkoutProcessSuccess.title`)).not.toBeInTheDocument();
  });

  it('should show purchase in process when the payment method is "mercado pago" and upgrade pending', async () => {
    // Act
    render(
      <CheckoutSummaryTitleElement paymentMethod={paymentType.mercadoPago} upgradePending={true} />,
    );

    // Assert
    screen.getByText(`checkoutProcessSuccess.mercado_pago_purchase_finished_title`);
    // It is the same title as in transfer
    screen.getByText(`checkoutProcessSuccess.transfer_title`);
    expect(
      screen.queryByText(`checkoutProcessSuccess.purchase_finished_title`),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(`checkoutProcessSuccess.title`)).not.toBeInTheDocument();
  });
});
