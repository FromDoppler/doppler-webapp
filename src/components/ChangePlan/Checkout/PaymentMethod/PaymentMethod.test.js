import { PaymentMethod } from './PaymentMethod';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import user from '@testing-library/user-event';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { fakePaymentMethodInformation } from '../../../../services/doppler-billing-user-api-client.double';
import { fakeAccountPlanDiscounts } from '../../../../services/doppler-account-plans-api-client.double';
import { actionPage } from '../Checkout';

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

const mockedHandleSaveAndContinue = jest.fn();
const mockedhandleChangeView = jest.fn();
const initialProps = {
  showTitle: false,
  handleChangeView: mockedhandleChangeView,
  optionView: actionPage.READONLY,
};

const initialPropsWithUpdate = {
  showTitle: false,
  handleChangeView: mockedhandleChangeView,
  optionView: actionPage.UPDATE,
  handleSaveAndContinue: mockedHandleSaveAndContinue,
};

const PaymentMethodElement = ({ withError, updateView }) => {
  const services = dependencies(withError);
  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <BrowserRouter>
          {updateView ? (
            <PaymentMethod {...initialPropsWithUpdate} />
          ) : (
            <PaymentMethod {...initialProps} />
          )}
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('PaymentMethod component', () => {
  it('readoly view - should show loading box while getting data', async () => {
    // Act
    render(<PaymentMethodElement withError={false} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('readonly view - should load data from api correctly', async () => {
    // Act
    render(<PaymentMethodElement withError={false} />);

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

    // Data should load correctly
    expect(creditCardOption.checked).toEqual(true);
    expect(transferOption.checked).toEqual(false);
    expect(mercadoPagoOption.checked).toEqual(false);
  });

  it("readonly view - should be check 'CC' as default when the the response is not success", async () => {
    // Act
    render(<PaymentMethodElement withError={true} />);

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

    // Data should load correctly
    expect(creditCardOption.checked).toEqual(true);
    expect(transferOption.checked).toEqual(false);
    expect(mercadoPagoOption.checked).toEqual(false);
  });

  it('update view - should show messages for empty required fields', async () => {
    // Act
    render(<PaymentMethodElement withError={false} updateView={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'checkoutProcessForm.save_continue' });
    user.click(submitButton);

    // Validation error messages should be displayed
    const validationErrorMessages = await screen.findAllByText(
      'validation_messages.error_required_field',
    );
    expect(validationErrorMessages).toHaveLength(4);
  });
});
