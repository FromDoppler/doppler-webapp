import { render, screen, act, waitFor } from '@testing-library/react';
import IntlProvider from '../../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { actionPage } from '../../../Checkout';
import { Formik, Form } from 'formik';
import { TransferColombia } from '.';
import { getFormInitialValues } from '../../../../../../utils';
import { fieldNames } from '../../PaymentMethod';

const initialPropsReonlyView = {
  readOnly: true,
};

const initialPropsUpdateView = {
  readOnly: false,
};

const TransferColombiaElement = ({ paymentMethod, optionView }) => {
  return (
    <AppServicesProvider>
      <IntlProvider>
        <BrowserRouter>
          <Formik initialValues={getFormInitialValues(fieldNames)}>
            <Form>
              {optionView === actionPage.UPDATE ? (
                <TransferColombia {...initialPropsUpdateView} paymentMethod={paymentMethod} />
              ) : (
                <TransferColombia {...initialPropsReonlyView} paymentMethod={paymentMethod} />
              )}
            </Form>
          </Formik>
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('Transer Colombia component', () => {
  it('should show the correct data in readonly view', async () => {
    //Arrange
    const paymentMethod = {
      identificationNumber: '123456',
      razonSocial: 'Test Company',
    };

    // Act
    render(
      <TransferColombiaElement paymentMethod={paymentMethod} optionView={actionPage.READONLY} />,
    );

    // Assert
    expect(
      screen.getByText(
        `NIT: ${paymentMethod?.identificationNumber}, ${paymentMethod?.razonSocial}`,
      ),
    ).toBeInTheDocument();
  });

  it('should show the correct data in update view', async () => {
    //Arrange
    const paymentMethod = {
      identificationNumber: '123456',
      razonSocial: 'Test Company',
    };

    // Act
    render(
      <TransferColombiaElement paymentMethod={paymentMethod} optionView={actionPage.UPDATE} />,
    );

    await waitFor(async () => {
      const inputIdentificationNumber = await screen.findByRole('textbox', {
        name: 'identificationNumber',
      });

      const inputBusinessName = await screen.findByRole('textbox', {
        name: '*checkoutProcessForm.payment_method.business_name',
      });

      expect(inputBusinessName).toHaveValue(paymentMethod.razonSocial);
      expect(inputIdentificationNumber).toHaveValue(paymentMethod.identificationNumber);
    });
  });
});
