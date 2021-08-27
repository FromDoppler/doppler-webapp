import { PaymentMethod } from './PaymentMethod';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { fakePaymentMethodInformation } from '../../../../services/doppler-billing-user-api-client.double';
import { fakeAccountPlanDiscounts } from '../../../../services/doppler-account-plans-api-client.double';

const dependencies = (withError) => ({
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
  dopplerBillingUserApiClient: {
    getPaymentMethodData: async () => {
      return !withError
        ? { success: true, value: fakePaymentMethodInformation }
        : { success: false };
    },
  },
  dopplerAccountPlansApiClient: {
    getDiscountsData: async (planId, paymentMethod) => {
      return { success: true, value: fakeAccountPlanDiscounts };
    },
  },
});

const initialProps = {
  showTitle: false,
};

const PaymentMethodElement = ({ withError }) => {
  const services = dependencies(withError);
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

describe('PaymentMethod component', () => {
  it('should show loading box while getting data', async () => {
    // Act
    render(<PaymentMethodElement withError={false} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('should load data from api correctly', async () => {
    // Act
    const { container } = render(<PaymentMethodElement withError={false} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const creditCardOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method.credit_card',
    });
    const transferOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method.transfer',
    });
    const mercadoPagoOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method.mercado_pago',
    });

    const cardNumberElement = container.querySelector('.rccs__number');
    const cardHolderElement = container.querySelector('.rccs__name');
    const expiryDateElement = container.querySelector('.rccs__expiry__value');
    const securityCodeElement = container.querySelector('.rccs__cvc');

    // Data should load correctly
    expect(creditCardOption.checked).toEqual(true);
    expect(transferOption.checked).toEqual(false);
    expect(mercadoPagoOption.checked).toEqual(false);

    expect(cardNumberElement.textContent.replace(/\s/g, '')).toEqual(
      fakePaymentMethodInformation.ccNumber,
    );
    expect(cardHolderElement.textContent).toEqual(fakePaymentMethodInformation.ccHolderName);
    expect(expiryDateElement.textContent).toEqual(fakePaymentMethodInformation.ccExpiryDate);
    expect(securityCodeElement.textContent).toEqual(fakePaymentMethodInformation.ccSecurityCode);
  });

  it("should be check 'CC' as default when the the response is not success", async () => {
    // Act
    const emptyCardNumber = '••••••••••••••••';
    const emptyHolderName = 'YOUR NAME HERE';
    const emptyExpiryDate = '••/••';
    const { container } = render(<PaymentMethodElement withError={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const creditCardOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method.credit_card',
    });
    const transferOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method.transfer',
    });
    const mercadoPagoOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method.mercado_pago',
    });

    const cardNumberElement = container.querySelector('.rccs__number');
    const cardHolderElement = container.querySelector('.rccs__name');
    const expiryDateElement = container.querySelector('.rccs__expiry__value');
    const securityCodeElement = container.querySelector('.rccs__cvc');

    // Data should load correctly
    expect(creditCardOption.checked).toEqual(true);
    expect(transferOption.checked).toEqual(false);
    expect(mercadoPagoOption.checked).toEqual(false);

    expect(cardNumberElement.textContent.replaceAll(/\s/g, '')).toEqual(emptyCardNumber);
    expect(cardHolderElement.textContent).toEqual(emptyHolderName);
    expect(expiryDateElement.textContent).toEqual(emptyExpiryDate);
    expect(securityCodeElement.textContent).toEqual('');
  });
});
