import { render, screen, act, waitFor } from '@testing-library/react';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { fakePaymentMethodInformation } from '../../../../services/doppler-billing-user-api-client.double';
import { fakeAccountPlanDiscounts } from '../../../../services/doppler-account-plans-api-client.double';
import { actionPage } from '../Checkout';
import { CreditCard } from './CreditCard';
import { Formik } from 'formik';
import '@testing-library/jest-dom/extend-expect';

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
  dopplerAccountPlansApiClient: {
    getDiscountsData: async () => {
      return { success: true, value: fakeAccountPlanDiscounts };
    },
  },
});

const mockedSetFieldValue = jest.fn();
const mockedSetHandleSubmit = jest.fn();
const initialPropsReonlyView = {
  handleChangeView: mockedSetFieldValue,
  optionView: actionPage.READONLY,
  setHandleSubmit: mockedSetHandleSubmit,
};

const initialPropsUpdateView = {
  setFieldValue: mockedSetFieldValue,
  optionView: actionPage.UPDATE,
  setHandleSubmit: mockedSetHandleSubmit,
};

const getFormFields = (container, updateView) => {
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

const CreditCardElement = ({ withError, updateView }) => {
  const services = dependencies(withError);
  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <BrowserRouter>
          <Formik
            initialValues={{}}
            onSubmit={() => {}}
          >
            {updateView === actionPage.UPDATE ? (
              <CreditCard
                {...initialPropsUpdateView}
                paymentMethod={withError ? null : { ...fakePaymentMethodInformation }}
              />
            ) : (
              <CreditCard
                {...initialPropsReonlyView}
                paymentMethod={withError ? null : { ...fakePaymentMethodInformation }}
              />
            )}
          </Formik>
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('CreditCard component', () => {
  it('readonly view - should load data from api correctly', async () => {
    // Act
    const { container } = render(
      <CreditCardElement withError={false} updateView={actionPage.READONLY} />,
    );

    // Assert
    await waitFor(() => {
      const { cardNumberElement, cardHolderElement, expiryDateElement, securityCodeElement } =
        getFormFields(container, false);

      expect(cardNumberElement.textContent.replace(/\s/g, '')).toEqual(
        fakePaymentMethodInformation.ccNumber,
      );
      expect(cardHolderElement.textContent).toEqual(fakePaymentMethodInformation.ccHolderName);
      expect(expiryDateElement.textContent).toEqual(fakePaymentMethodInformation.ccExpiryDate);
      expect(securityCodeElement.textContent).toEqual(fakePaymentMethodInformation.ccSecurityCode);
    });
  });

  it('update view - should show empty data', async () => {
    // Act
    const emptyCardNumber = '••••••••••••••••';
    const emptyHolderName = 'checkoutProcessForm.payment_method.placeholder_holder_name';
    const emptyExpiryDate = '••/••';

    const { container } = render(
      <CreditCardElement withError={false} updateView={actionPage.UPDATE} />,
    );

    // Assert
    let {
      cardNumberElement,
      cardHolderElement,
      expiryDateElement,
      securityCodeElement,
      inputNumber,
      inputExpiryDate,
      inputHolderName,
      inputSecurityCode,
    } = getFormFields(container, true);

    inputNumber = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.credit_card',
    });
    inputExpiryDate = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.expiration_date',
    });
    inputHolderName = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.holder_name',
    });
    inputSecurityCode = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.security_code',
    });

    expect(inputNumber.value).toEqual('');
    expect(inputExpiryDate.value).toEqual('');
    expect(inputHolderName.value).toEqual('');
    expect(inputSecurityCode.value).toEqual('');
    expect(cardNumberElement.textContent.replace(/\s/g, '')).toEqual(emptyCardNumber);
    expect(cardHolderElement.textContent).toEqual(emptyHolderName);
    expect(expiryDateElement.textContent).toEqual(emptyExpiryDate);
    expect(securityCodeElement.textContent).toEqual('');
  });

  it('should be empty values in the card when the the response is not success', async () => {
    // Act
    const emptyCardNumber = '••••••••••••••••';
    const emptyHolderName = 'checkoutProcessForm.payment_method.placeholder_holder_name';
    const emptyExpiryDate = '••/••';

    const { container } = render(
      <CreditCardElement withError={true} updateView={actionPage.READONLY} />,
    );

    // Assert
    const { cardNumberElement, cardHolderElement, expiryDateElement, securityCodeElement } =
      getFormFields(container, false);

    expect(cardNumberElement.textContent.replace(/\s/g, '')).toEqual(emptyCardNumber);
    expect(cardHolderElement.textContent).toEqual(emptyHolderName);
    expect(expiryDateElement.textContent).toEqual(emptyExpiryDate);
    expect(securityCodeElement.textContent).toEqual('');
  });

  it('update view - should show the available credit cards legend', async () => {
    // Act
    await act(() => render(<CreditCardElement withError={false} updateView={actionPage.UPDATE} />));

    // Assert
    const avalilableCrediCardsLegend = await screen.findByText(
      'checkoutProcessForm.payment_method.availabled_credit_cards_legend',
    );

    expect(avalilableCrediCardsLegend).toBeInTheDocument();
  });

  it('readonly view - should hide the available credit cards legend', async () => {
    // Act
    render(<CreditCardElement withError={false} updateView={actionPage.READONLY} />);

    // Assert
    const avalilableCrediCardsLegend = screen.queryByText(
      'checkoutProcessForm.payment_method.availabled_credit_cards_legend',
    );

    expect(avalilableCrediCardsLegend).not.toBeInTheDocument();
  });
});
