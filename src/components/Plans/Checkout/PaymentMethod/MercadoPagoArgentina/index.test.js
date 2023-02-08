import { render, screen } from '@testing-library/react';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter } from 'react-router-dom';
import { fakePaymentMethodInformation } from '../../../../../services/doppler-billing-user-api-client.double';
import { actionPage } from '../../Checkout';
import { Formik } from 'formik';
import '@testing-library/jest-dom/extend-expect';
import { MercadoPagoArgentina } from '.';

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

const MercadoPagoArgentinaElement = ({ updateView }) => {
  return (
    <IntlProvider>
      <BrowserRouter>
        <Formik>
          {updateView === actionPage.UPDATE ? (
            <MercadoPagoArgentina
              {...initialPropsUpdateView}
              paymentMethod={{ ...fakePaymentMethodInformation, dni: 12345678 }}
            />
          ) : (
            <MercadoPagoArgentina
              {...initialPropsReonlyView}
              paymentMethod={{ ...fakePaymentMethodInformation, dni: 12345678 }}
            />
          )}
        </Formik>
      </BrowserRouter>
    </IntlProvider>
  );
};

describe('MercadoPagoArgentina component', () => {
  it('readonly view - should load data from api correctly', async () => {
    // Act
    const { container } = render(<MercadoPagoArgentinaElement updateView={actionPage.READONLY} />);

    // Assert
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
