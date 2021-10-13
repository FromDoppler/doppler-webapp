import { PaymentMethod } from './PaymentMethod';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import user from '@testing-library/user-event';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import {
  fakeBillingInformation,
  fakePaymentMethodInformation,
} from '../../../../services/doppler-billing-user-api-client.double';
import { fakeAccountPlanDiscounts } from '../../../../services/doppler-account-plans-api-client.double';
import { actionPage } from '../Checkout';
import { fakeConsumerTypes } from '../../../../services/static-data-client.double';
import '@testing-library/jest-dom/extend-expect';

const dependencies = (withError, paymentMethodData) => ({
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
        ? {
            success: true,
            value: paymentMethodData,
          }
        : { success: false };
    },
    getBillingInformationData: async () => {
      return { success: true, value: fakeBillingInformation };
    },
  },
  dopplerAccountPlansApiClient: {
    getDiscountsData: async (planId, paymentMethod) => {
      return { success: true, value: fakeAccountPlanDiscounts };
    },
  },
  staticDataClient: {
    getConsumerTypesData: async (country, language) => ({
      success: true,
      value: fakeConsumerTypes,
    }),
  },
});

const mockedHandleSaveAndContinue = jest.fn();
const mockedhandleChangeView = jest.fn();
const mockedhandleChangeDiscount = jest.fn();
const initialProps = {
  showTitle: false,
  handleChangeView: mockedhandleChangeView,
  handleChangeDiscount: mockedhandleChangeDiscount,
  optionView: actionPage.READONLY,
};

const initialPropsWithUpdate = {
  showTitle: false,
  handleChangeView: mockedhandleChangeView,
  optionView: actionPage.UPDATE,
  handleSaveAndContinue: mockedHandleSaveAndContinue,
  handleChangeDiscount: mockedhandleChangeDiscount,
};

const PaymentMethodElement = ({ withError, paymentMethodData, updateView }) => {
  const services = dependencies(withError, paymentMethodData);
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
    render(
      <PaymentMethodElement withError={false} paymentMethodData={fakePaymentMethodInformation} />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('readonly view - should load data from api correctly', async () => {
    // Act
    render(
      <PaymentMethodElement withError={false} paymentMethodData={fakePaymentMethodInformation} />,
    );

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
    render(
      <PaymentMethodElement withError={true} paymentMethodData={fakePaymentMethodInformation} />,
    );

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
    render(
      <PaymentMethodElement
        withError={false}
        updateView={true}
        paymentMethodData={fakePaymentMethodInformation}
      />,
    );

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

  it('update view - transfer - should show error message when the cuit is not valid', async () => {
    //Arrange
    const fakeTransferInformation = {
      paymentMethodName: 'TRANSF',
      razonSocial: 'Company Test',
      idConsumerType: 'RI',
      identificationNumber: '',
    };

    // Act
    render(
      <PaymentMethodElement
        withError={false}
        updateView={true}
        paymentMethodData={fakeTransferInformation}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    let inputIdentificationNumber = await screen.findByRole('textbox', {
      name: 'identificationNumber',
    });
    user.clear(inputIdentificationNumber);
    user.type(inputIdentificationNumber, '12345678');

    inputIdentificationNumber = await screen.findByRole('textbox', {
      name: 'identificationNumber',
    });
    expect(inputIdentificationNumber).toHaveValue('12345678');

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'checkoutProcessForm.save_continue' });
    user.click(submitButton);

    //Validation error messages should be displayed
    const validationErrorMessages = await screen.findByText(
      'validation_messages.error_invalid_cuit',
    );
    expect(validationErrorMessages).toBeInTheDocument();
  });

  describe.each([
    ['should show messages for empty required fields for "Consumidor Final"', '', '', 'CF', 1],
    ['should show messages for empty required fields for "Responsable Inscripto"', '', '', 'RI', 2],
    ['should show messages for empty required fields without consumer type', '', '', '', 1],
  ])(
    'update view - transfer',
    (testName, businessName, identificationNumber, idConsumerType, requiredFields) => {
      it(testName, async () => {
        //Arrange
        const fakeTransferInformation = {
          paymentMethodName: 'TRANSF',
          razonSocial: businessName,
          idConsumerType: idConsumerType,
          identificationNumber: identificationNumber,
        };

        // Act
        render(
          <PaymentMethodElement
            withError={false}
            updateView={true}
            paymentMethodData={fakeTransferInformation}
          />,
        );

        // Assert
        // Loader should disappear once request resolves
        const loader = screen.getByTestId('wrapper-loading');
        await waitForElementToBeRemoved(loader);

        // Click save button
        const submitButton = screen.getByRole('button', {
          name: 'checkoutProcessForm.save_continue',
        });
        user.click(submitButton);

        // Validation error messages should be displayed
        const validationErrorMessages = await screen.findAllByText(
          'validation_messages.error_required_field',
        );
        expect(validationErrorMessages).toHaveLength(requiredFields);
      });
    },
  );
});
