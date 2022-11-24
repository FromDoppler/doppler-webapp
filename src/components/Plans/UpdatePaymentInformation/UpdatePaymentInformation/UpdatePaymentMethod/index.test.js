import { UpdatePaymentMethod } from './index';
import { render, screen, waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import user from '@testing-library/user-event';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { fakePaymentMethodInformation } from '../../../../../services/doppler-billing-user-api-client.double';
import { actionPage } from '../../../Checkout/Checkout';
import '@testing-library/jest-dom/extend-expect';

const dependencies = (withError, paymentMethodData, withFirstDataError, firstDataError) => ({
  dopplerBillingUserApiClient: {
    getPaymentMethodData: async () => {
      return !withError
        ? {
            success: true,
            value: paymentMethodData,
          }
        : { success: false };
    },
    updatePaymentMethod: async () => {
      return !withFirstDataError
        ? { success: true }
        : { success: false, error: { response: { data: firstDataError } } };
    },
  },
});

const mockedHandleSaveAndContinue = jest.fn();
const mockedhandleChangeView = jest.fn();

const initialProps = {
  handleChangeView: mockedhandleChangeView,
  optionView: actionPage.READONLY,
};

const initialPropsWithUpdate = {
  handleChangeView: mockedhandleChangeView,
  optionView: actionPage.UPDATE,
  handleSaveAndContinue: mockedHandleSaveAndContinue,
};

const UpdatePaymentMethodElement = ({
  withError,
  paymentMethodData,
  updateView,
  withFirstDataError,
  firstDataError,
}) => {
  const services = dependencies(withError, paymentMethodData, withFirstDataError, firstDataError);
  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <BrowserRouter>
          {updateView ? (
            <UpdatePaymentMethod {...initialPropsWithUpdate} />
          ) : (
            <UpdatePaymentMethod {...initialProps} />
          )}
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('UpdatePaymentMethod component', () => {
  it('readoly view - should show loading box while getting data', async () => {
    // Act
    render(
      <UpdatePaymentMethodElement
        withError={false}
        paymentMethodData={fakePaymentMethodInformation}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);
  });

  it('update view - should show messages for empty required fields', async () => {
    // Act
    render(
      <UpdatePaymentMethodElement
        withError={false}
        updateView={true}
        paymentMethodData={fakePaymentMethodInformation}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'updatePaymentMethod.payment_method.save_continue_button',
    });
    await user.click(submitButton);

    // Validation error messages should be displayed
    const validationErrorMessages = await screen.findAllByText(
      'validation_messages.error_required_field',
    );
    expect(validationErrorMessages).toHaveLength(4);
  });

  describe.each([
    [
      'should show the expiration date invalid message when the user enter an incorrect date',
      'checkoutProcessForm.payment_method.expiration_date',
      '12/2021',
      'DeclinedPaymentTransaction - Invalid Expiration Date [Bank]',
      'checkoutProcessForm.payment_method.first_data_error.invalid_expiration_date',
    ],
    [
      'should show the credit card number invalid message when the user enter an incorrect number',
      'checkoutProcessForm.payment_method.credit_card',
      '4999999999999999',
      'DeclinedPaymentTransaction - Invalid Credit Card Number',
      'checkoutProcessForm.payment_method.first_data_error.invalid_credit_card_number',
    ],
  ])(
    'update view - credit card - first data error',
    (testName, fieldName, fieldValue, firstDataError, firstDataErrorKey) => {
      it(testName, async () => {
        // Act
        render(
          <UpdatePaymentMethodElement
            withError={false}
            updateView={true}
            paymentMethodData={fakePaymentMethodInformation}
            withFirstDataError={true}
            firstDataError={firstDataError}
          />,
        );

        // Loader should disappear once request resolves
        const loader = screen.getByTestId('loading-box');
        await waitForElementToBeRemoved(loader);

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
          name: 'updatePaymentMethod.payment_method.save_continue_button',
        });
        await user.click(submitButton);

        // Validation error messages should be displayed
        const error = await screen.findAllByText(firstDataErrorKey);
        expect(error).not.toBeNull();
      });
    },
  );
});
