import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PaymentMethodType, PLAN_TYPE } from '../../../../doppler-types';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { Clarification } from '.';

describe('Clarification', () => {
  it('should render clarification component when plan is by credit and payment is CC', async () => {
    // Arrange
    const props = {
      planType: PLAN_TYPE.byCredit,
      paymentMethodType: PaymentMethodType.mercadoPago,
    };

    // Act
    render(
      <IntlProvider>
        <Clarification {...props} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText(/checkoutProcessForm.purchase_summary.explanatory_legend_by_credits/i);
  });

  it('should render clarification component when payment is CC and is upgrade', async () => {
    // Arrange
    const props = {
      planType: PLAN_TYPE.byContact,
      paymentMethodType: PaymentMethodType.mercadoPago,
      isFree: false,
      majorThat21st: true,
    };

    // Act
    render(
      <IntlProvider>
        <Clarification {...props} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('checkoutProcessForm.purchase_summary.upgrade_plan_legend');
  });

  it('should render clarification component when payment is MP and is upgrade', async () => {
    // Arrange
    const props = {
      planType: PLAN_TYPE.byContact,
      paymentMethodType: PaymentMethodType.mercadoPago,
      isFree: false,
      majorThat21st: true,
    };

    // Act
    render(
      <IntlProvider>
        <Clarification {...props} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('checkoutProcessForm.purchase_summary.upgrade_plan_legend');
  });
});
