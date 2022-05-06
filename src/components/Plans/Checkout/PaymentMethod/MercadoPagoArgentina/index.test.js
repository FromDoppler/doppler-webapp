import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { fakePaymentMethodInformation } from '../../../../../services/doppler-billing-user-api-client.double';
import { actionPage } from '../../Checkout';
import { Formik } from 'formik';
import '@testing-library/jest-dom/extend-expect';
import { MercadoPagoArgentina } from '.';

const dependencies = (withError) => ({
  dopplerBillingUserApiClient: {
    getPaymentMethodData: async () => {
      return !withError
        ? { success: true, value: { ...fakePaymentMethodInformation, dni: 12345678 } }
        : { success: false };
    },
  },
});

const mockedSetFieldValue = jest.fn();
const initialPropsReonlyView = {
  handleChangeView: mockedSetFieldValue,
  optionView: actionPage.READONLY,
};

const initialPropsUpdateView = {
  setFieldValue: mockedSetFieldValue,
  optionView: actionPage.UPDATE,
};

const getCreditCardFields = (container, updateView) => {
  let inputNumber;
  let inputExpiryDate;
  let inputHolderName;
  let inputSecurityCode;

  if (updateView) {
    inputNumber = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.credit_card',
    });
    inputExpiryDate = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.expiration_date',
    });
    inputHolderName = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.holder_name',
    });
    inputSecurityCode = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.security_code',
    });
  }

  const cardNumberElement = container.querySelector('.rccs__number');
  const cardHolderElement = container.querySelector('.rccs__name');
  const expiryDateElement = container.querySelector('.rccs__expiry__value');
  const securityCodeElement = container.querySelector('.rccs__cvc');

  return {
    inputNumber,
    inputExpiryDate,
    inputHolderName,
    inputSecurityCode,
    cardNumberElement,
    cardHolderElement,
    expiryDateElement,
    securityCodeElement,
  };
};

const MercadoPagoArgentinaElement = ({ withError, updateView }) => {
  const services = dependencies(withError);
  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <BrowserRouter>
          <Formik>
            {updateView === actionPage.UPDATE ? (
              <MercadoPagoArgentina {...initialPropsUpdateView} />
            ) : (
              <MercadoPagoArgentina {...initialPropsReonlyView} />
            )}
          </Formik>
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('MercadoPagoArgentina component', () => {
  it('readonly view - should load data from api correctly', async () => {
    // Act
    const { container } = render(
      <MercadoPagoArgentinaElement withError={false} updateView={actionPage.READONLY} />,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const { cardNumberElement, cardHolderElement, expiryDateElement, securityCodeElement } =
      getCreditCardFields(container, false);

    expect(cardNumberElement.textContent.replace(/\s/g, '')).toEqual(
      fakePaymentMethodInformation.ccNumber,
    );
    expect(cardHolderElement.textContent).toEqual(fakePaymentMethodInformation.ccHolderName);
    expect(cardHolderElement.textContent).toEqual(fakePaymentMethodInformation.ccHolderName);
    expect(expiryDateElement.textContent).toEqual(fakePaymentMethodInformation.ccExpiryDate);

    const avalilableCrediCardsLegend = screen.queryByText(
      'checkoutProcessForm.payment_method.availabled_credit_cards_legend',
    );

    expect(avalilableCrediCardsLegend).not.toBeInTheDocument();
  });

  it('update view - should show empty data', async () => {
    // Arrange
    const emptyCardNumber = '••••••••••••••••';
    const emptyHolderName = 'checkoutProcessForm.payment_method.placeholder_holder_name';
    const emptyExpiryDate = '••/••';

    // Act
    const { container } = render(
      <MercadoPagoArgentinaElement withError={false} updateView={actionPage.UPDATE} />,
    );

    // Assert
    const { cardNumberElement, cardHolderElement, expiryDateElement, securityCodeElement } =
      getCreditCardFields(container, true);

    const inputNumber = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.credit_card',
    });
    const inputExpiryDate = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.expiration_date',
    });
    const inputHolderName = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.holder_name',
    });
    const inputSecurityCode = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.security_code',
    });
    const inputDni = await screen.findAllByLabelText('*checkoutProcessForm.payment_method.dni');

    expect(inputNumber).toHaveValue('');
    expect(inputExpiryDate).toHaveValue('');
    expect(inputHolderName).toHaveValue('');
    expect(inputSecurityCode).toHaveValue('');
    expect(inputDni.value).toEqual(undefined);
    expect(cardNumberElement.textContent.replace(/\s/g, '')).toEqual(emptyCardNumber);
    expect(cardHolderElement.textContent).toEqual(emptyHolderName);
    expect(expiryDateElement.textContent).toEqual(emptyExpiryDate);
    expect(securityCodeElement.textContent).toEqual('');
  });
});
