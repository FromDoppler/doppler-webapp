import { render, screen } from '@testing-library/react';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import '@testing-library/jest-dom/extend-expect';
import { CheckoutSummaryTitle } from '.';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';

const CheckoutSummaryTitleElement = ({ title }) => {
  return (
    <IntlProvider>
      <Router initialEntries={[`/checkout-summary?planId=19&paymentMethod=CC&accountType=FREE`]}>
        <Routes>
          <Route path="/checkout-summary" element={<CheckoutSummaryTitle title={title} />} />
        </Routes>
      </Router>
    </IntlProvider>
  );
};

describe('CheckoutSummaryTitle component', () => {
  it('should show the purchase finished when the payment method is "credit card"', async () => {
    // Act
    render(
      <CheckoutSummaryTitleElement
        title={{
          smallTitle: 'checkoutProcessSuccess.purchase_finished_title',
          largeTitle: 'checkoutProcessSuccess.title',
        }}
      />,
    );

    // Assert
    expect(screen.getByText(`checkoutProcessSuccess.purchase_finished_title`)).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_purchase_finished_title`),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(`checkoutProcessSuccess.transfer_title`)).not.toBeInTheDocument();
  });

  it('should show the purchase finished when the payment method is "transfer" and not upgrade pending', async () => {
    // Act
    render(
      <CheckoutSummaryTitleElement
        title={{
          smallTitle: 'checkoutProcessSuccess.purchase_finished_title',
          largeTitle: 'checkoutProcessSuccess.title',
        }}
      />,
    );

    // Assert
    expect(screen.getByText(`checkoutProcessSuccess.purchase_finished_title`)).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_purchase_finished_title`),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(`checkoutProcessSuccess.transfer_title`)).not.toBeInTheDocument();
  });

  it('should show purchase in process when the payment method is "transfer" and upgrade pending', async () => {
    // Act
    render(
      <CheckoutSummaryTitleElement
        title={{
          smallTitle: 'checkoutProcessSuccess.transfer_purchase_finished_title',
          largeTitle: 'checkoutProcessSuccess.transfer_title',
        }}
      />,
    );

    // Assert
    expect(
      screen.getByText(`checkoutProcessSuccess.transfer_purchase_finished_title`),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.purchase_finished_title`),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(`checkoutProcessSuccess.title`)).not.toBeInTheDocument();
  });

  it('should show purchase in process when the payment method is "mercado pago" and upgrade pending', async () => {
    // Act
    render(
      <CheckoutSummaryTitleElement
        title={{
          smallTitle: 'checkoutProcessSuccess.mercado_pago_purchase_finished_title',
          largeTitle: 'checkoutProcessSuccess.transfer_title',
        }}
      />,
    );

    // Assert
    screen.getByText(`checkoutProcessSuccess.mercado_pago_purchase_finished_title`);
    expect(
      screen.queryByText(`checkoutProcessSuccess.purchase_finished_title`),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(`checkoutProcessSuccess.title`)).not.toBeInTheDocument();
  });
});
