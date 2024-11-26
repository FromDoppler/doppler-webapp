import { PaymentMethod } from './PaymentMethod';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

const dependencies = (
  withError,
  paymentMethodData,
  billingInformationData,
  withFirstDataError,
  firstDataError,
) => ({
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
      return { success: true, value: billingInformationData };
    },
    updatePaymentMethod: async () => {
      return !withFirstDataError
        ? { success: true }
        : { success: false, error: { response: { data: firstDataError } } };
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
const mockedhandleChangePaymentMethod = jest.fn();
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
  handleChangePaymentMethod: mockedhandleChangePaymentMethod,
};

const PaymentMethodElement = ({
  withError,
  paymentMethodData,
  updateView,
  billingInformationData,
  appliedPromocode,
  withFirstDataError,
  firstDataError,
}) => {
  const services = dependencies(
    withError,
    paymentMethodData,
    billingInformationData,
    withFirstDataError,
    firstDataError,
  );
  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <BrowserRouter>
          {updateView ? (
            <PaymentMethod {...initialPropsWithUpdate} appliedPromocode={appliedPromocode} />
          ) : (
            <PaymentMethod {...initialProps} appliedPromocode={appliedPromocode} />
          )}
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('PaymentMethod component', () => {
  it('readoly view - should show loading box while getting data', async () => {
    // Act
    await act(() =>
      render(
        <PaymentMethodElement
          withError={false}
          paymentMethodData={fakePaymentMethodInformation}
          billingInformationData={fakeBillingInformation}
        />,
      ),
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.queryByTestId('wrapper-loading');
    expect(loader).not.toBeInTheDocument();
  });

  it('readonly view - should load data from api correctly', async () => {
    // Act
    await act(() =>
      render(
        <PaymentMethodElement
          withError={false}
          paymentMethodData={fakePaymentMethodInformation}
          billingInformationData={fakeBillingInformation}
        />,
      ),
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.queryByTestId('wrapper-loading');
    expect(loader).not.toBeInTheDocument();

    const creditCardOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method.credit_card_option',
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
    await act(() =>
      render(
        <PaymentMethodElement
          withError={true}
          paymentMethodData={fakePaymentMethodInformation}
          billingInformationData={fakeBillingInformation}
        />,
      ),
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.queryByTestId('wrapper-loading');
    expect(loader).not.toBeInTheDocument();

    const creditCardOption = screen.getByRole('radio', {
      name: 'checkoutProcessForm.payment_method.credit_card_option',
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

  it('update view - transfer - should show error message when the cuit is not valid', async () => {
    //Arrange
    const fakeTransferInformation = {
      paymentMethodName: 'TRANSF',
      razonSocial: 'Company Test',
      idConsumerType: 'RI',
      identificationNumber: '',
    };

    // Act
    await act(() =>
      render(
        <PaymentMethodElement
          withError={false}
          updateView={true}
          paymentMethodData={fakeTransferInformation}
          billingInformationData={fakeBillingInformation}
        />,
      ),
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.queryByTestId('wrapper-loading');
    expect(loader).not.toBeInTheDocument();

    let inputIdentificationNumber = await screen.findByRole('textbox', {
      name: 'identificationNumber',
    });
    await act(() => user.clear(inputIdentificationNumber));
    await act(() => user.type(inputIdentificationNumber, '12345678'));

    inputIdentificationNumber = await screen.findByRole('textbox', {
      name: 'identificationNumber',
    });
    expect(inputIdentificationNumber).toHaveValue('12345678');

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'checkoutProcessForm.save_continue' });
    await act(() => user.click(submitButton));

    //Validation error messages should be displayed
    const validationErrorMessages = await screen.findByText(
      'validation_messages.error_invalid_cuit',
    );
    expect(validationErrorMessages).toBeInTheDocument();
  });

  it('should show information message when the promocode was applied', async () => {
    // Act
    await act(() =>
      render(
        <PaymentMethodElement
          withError={true}
          paymentMethodData={fakePaymentMethodInformation}
          billingInformationData={fakeBillingInformation}
          appliedPromocode={true}
        />,
      ),
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.queryByTestId('wrapper-loading');
    expect(loader).not.toBeInTheDocument();

    //Promocode message should be displayed
    const promocodeMessage = await screen.findByText(
      'checkoutProcessForm.payment_method.applied_promocode_tooltip',
    );
    expect(promocodeMessage).toBeInTheDocument();
  });

  describe.each([
    ['should show messages for empty required fields for "Consumidor Final"', '', '', 'CF', 2],
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
        await act(() =>
          render(
            <PaymentMethodElement
              withError={false}
              updateView={true}
              paymentMethodData={fakeTransferInformation}
              billingInformationData={fakeBillingInformation}
            />,
          ),
        );

        // Assert
        // Loader should disappear once request resolves
        const loader = screen.queryByTestId('wrapper-loading');
        expect(loader).not.toBeInTheDocument();

        // Click save button
        const submitButton = screen.getByRole('button', {
          name: 'checkoutProcessForm.save_continue',
        });
        await act(() => user.click(submitButton));

        // Validation error messages should be displayed
        const validationErrorMessages = await screen.findAllByText(
          'validation_messages.error_required_field',
        );
        expect(validationErrorMessages).toHaveLength(requiredFields);
      });
    },
  );

  describe.each([
    [
      'should show only credit card option when billing country is different than Argentina, Mexico and Colombia',
      'cl',
      'CL-AT',
    ],
    [
      'should show only credit card option and transfer disabled when billing country is equal Mexico or Colombia',
      'mx',
      'MX-DI',
    ],
    [
      'should show only credit card, transfer disabled and mercadopago when billing country is equal Argentina',
      'ar',
      'AR-B',
    ],
  ])('update view - credit card ', (testName, country, state) => {
    it(testName, async () => {
      //Arrange
      const fakeBillingInformation = {
        sameAddressAsContact: false,
        firstname: 'aa',
        lastname: 'Test',
        address: 'Alem 1234',
        city: 'city',
        province: state,
        country: country,
        zipCode: '7000',
        phone: '+54 249 422-2222',
      };

      // Act
      await act(() =>
        render(
          <PaymentMethodElement
            withError={true}
            paymentMethodData={fakePaymentMethodInformation}
            billingInformationData={fakeBillingInformation}
          />,
        ),
      );

      // Assert
      // Loader should disappear once request resolves
      const loader = screen.queryByTestId('wrapper-loading');
      expect(loader).not.toBeInTheDocument();

      const creditCardOption = screen.queryByRole('radio', {
        name: 'checkoutProcessForm.payment_method.credit_card_option',
      });
      const transferOption = screen.queryByRole('radio', {
        name: 'checkoutProcessForm.payment_method.transfer',
      });
      const mercadoPagoOption = screen.queryByRole('radio', {
        name: 'checkoutProcessForm.payment_method.mercado_pago',
      });

      expect(creditCardOption).toBeChecked(true);

      if (country !== 'ar' && country !== 'mx' && country !== 'co') {
        expect(transferOption).toBeNull();
      } else {
        expect(transferOption).toBeDisabled(true);
      }

      if (country !== 'ar') {
        expect(mercadoPagoOption).toBeNull();
      } else {
        expect(mercadoPagoOption).not.toBeChecked(true);
      }
    });
  });

  describe.each([
    [
      'should show the expiration date invalid message when the user enter an incorrect date',
      'checkoutProcessForm.payment_method.expiration_date',
      '12/2021',
      'DeclinedPaymentTransaction - Invalid Expiration Date [Bank]',
      'checkoutProcessForm.payment_method.first_data_error.invalid_expiration_date',
    ],
  ])(
    'update view - credit card - first data error',
    (testName, fieldName, fieldValue, firstDataError, firstDataErrorKey) => {
      it(testName, async () => {
        // Act
        await act(() =>
          render(
            <PaymentMethodElement
              withError={false}
              updateView={true}
              paymentMethodData={fakePaymentMethodInformation}
              billingInformationData={fakeBillingInformation}
              withFirstDataError={true}
              firstDataError={firstDataError}
            />,
          ),
        );

        // Loader should disappear once request resolves
        const loader = screen.queryByTestId('wrapper-loading');
        expect(loader).not.toBeInTheDocument();

        const inputNumber = screen.getByRole('textbox', {
          name: '*checkoutProcessForm.payment_method.credit_card',
        });
        const inputExpiryDate = screen.getByRole('textbox', {
          name: '*checkoutProcessForm.payment_method.expiration_date',
        });
        const inputHolderName = screen.getByRole('textbox', {
          name: '*checkoutProcessForm.payment_method.holder_name',
        });
        const inputSecurityCode = screen.getByRole('textbox', {
          name: '*checkoutProcessForm.payment_method.security_code',
        });

        fireEvent.change(inputNumber, { target: { value: '4111111111111111' } });
        fireEvent.change(inputExpiryDate, { target: { value: '12/2025' } });
        const inputFiedToUpdate = screen.getByRole('textbox', {
          name: '*' + fieldName,
        });
        fireEvent.change(inputFiedToUpdate, { target: { value: fieldValue } });
        fireEvent.change(inputHolderName, { target: { value: 'test' } });
        fireEvent.change(inputSecurityCode, { target: { value: '123' } });

        // Click save button
        const submitButton = screen.getByRole('button', {
          name: 'checkoutProcessForm.save_continue',
        });
        await act(() => user.click(submitButton));

        // Validation error messages should be displayed
        const error = await screen.findAllByText(firstDataErrorKey);
        expect(error).not.toBeNull();
      });
    },
  );
});
