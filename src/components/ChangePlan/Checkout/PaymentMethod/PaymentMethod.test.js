import { PaymentMethod } from './PaymentMethod';
import { render, screen, container, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { fakePaymentMethodInformation } from '../../../../services/doppler-billing-user-api-client.double';

describe('PaymentMethod component', () => {
  const dependencies = () => ({
    appSessionRef: {
      current: {
        userData: {
          user: {
            email: 'hardcoded@email.com',
            plan: {
              planType: '1',
              planSubscription: 1,
              monthPlan: 1,
            },
          },
        },
      },
    },
  });

  const initialProps = {
    showTitle: false,
  };

  const PaymentMethodElement = () => {
    const services = dependencies();
    return (
      <AppServicesProvider forcedServices={services}>
        <IntlProvider>
          <BrowserRouter>
            <PaymentMethod {...initialProps} />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>
    );
  };

  it('should show loading box while getting data', async () => {
    // Act
    render(<PaymentMethodElement />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('should load data from api correctly', async () => {
    // Act
    const { container } = render(<PaymentMethodElement />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const creditCardOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method_credit_card_method',
    });
    const transferOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method_transfer_method',
    });
    const mercadoPagoOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method_mercado_pago_method',
    });

    const cardNumberElement = container.querySelector('.rccs__number');
    const cardHolderElement = container.querySelector('.rccs__name');
    const expiryDateElement = container.querySelector('.rccs__expiry__value');
    const securityCodeElement = container.querySelector('.rccs__cvc');

    // Data should load correctly
    expect(creditCardOption.checked).toEqual(true);
    expect(transferOption.checked).toEqual(false);
    expect(mercadoPagoOption.checked).toEqual(false);

    expect(cardNumberElement.textContent.replaceAll(/\s/g, '')).toEqual(
      fakePaymentMethodInformation.ccNumber,
    );
    expect(cardHolderElement.textContent).toEqual(fakePaymentMethodInformation.ccHolderName);
    expect(expiryDateElement.textContent).toEqual(fakePaymentMethodInformation.expiryDate);
    expect(securityCodeElement.textContent).toEqual(fakePaymentMethodInformation.ccSecurityCode);
  });
});
