import { getAllByRole, getByText, render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PAYMENT_WAY_TRANSFER, TransferMexico } from '.';
import IntlProvider from '../../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../../services/pure-di';
import { Formik } from 'formik';
import userEvent from '@testing-library/user-event';

const fakeCfdi = {
  G03: 'G03',
  P01: 'P01',
};

export const fakePaymentWays = {
  CASH: 'CASH',
  CHECK: 'CHECK',
  TRANSFER: PAYMENT_WAY_TRANSFER,
};

export const fakePaymentTypes = {
  PPD: 'PPD',
  PUE: 'PUE',
};

const services = {
  staticDataClient: {
    getUseCfdiData: async (language) => ({
      success: true,
      value: fakeCfdi,
    }),
    getPaymentTypesData: async (language) => ({
      success: true,
      value: fakePaymentTypes,
    }),
    getPaymentWaysData: async (language) => ({
      success: true,
      value: fakePaymentWays,
    }),
  },
};

describe('TransferMexico', () => {
  it('should render the resume data when is read only mode', async () => {
    // Arrange
    const readOnly = true;
    const fakePaymentMethod = {
      identificationNumber: 'CAAR530917EV7',
      razonSocial: 'Boris Marketing',
      useCFDI: 'G03',
      paymentType: 'PPD',
      paymentWay: PAYMENT_WAY_TRANSFER,
      bankName: 'bank of america',
      bankAccount: '1234',
    };

    // Act
    await act(() =>
      render(
        <AppServicesProvider forcedServices={services}>
          <IntlProvider>
            <Formik initialValues={{}}>
              <TransferMexico
                readOnly={readOnly}
                paymentMethod={fakePaymentMethod}
                consumerTypes={null}
              />
            </Formik>
          </IntlProvider>
        </AppServicesProvider>,
      ),
    );

    // Assert
    const resumeData = await screen.findByRole('listitem', { name: 'resume data' });
    getByText(resumeData, /CAAR530917EV7/i);
    getByText(resumeData, /Boris Marketing/i);
    expect(
      screen.queryByRole('tabpanel', { name: 'transfer mexico fields' }),
    ).not.toBeInTheDocument();
  });

  describe('should render TransferMexico component when is edit mode', () => {
    // Arrange
    const fakeConsumerTypes = [{ key: 'RFC', value: 'Registro Federal de Contribuyentes' }];
    const readOnly = false;
    const fakePaymentMethod = {
      identificationNumber: '',
      razonSocial: '',
      useCFDI: '',
      paymentType: '',
      paymentWay: '',
      bankName: '',
      bankAccount: '',
    };

    it('should render the transfer mexico form with the correct fields', async () => {
      // Arrange
      const RFC = fakeConsumerTypes[0];

      // Act
      render(
        <AppServicesProvider forcedServices={services}>
          <IntlProvider>
            <Formik initialValues={{}}>
              <TransferMexico
                readOnly={readOnly}
                paymentMethod={fakePaymentMethod}
                consumerTypes={fakeConsumerTypes}
              />
            </Formik>
          </IntlProvider>
        </AppServicesProvider>,
      );

      // Assert
      const getConsumerTypeField = () =>
        screen.getByLabelText(/checkoutProcessForm.payment_method.consumer_type/i);
      let consumerTypeField = getConsumerTypeField();

      // Initially, all fields are not in the document
      expect(screen.queryByLabelText(/RFC/i)).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.business_name/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.cfdi/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.title/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.payment_way/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.bank_name/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.bank_account/i),
      ).not.toBeInTheDocument();

      // +1 because default option is included
      expect(getAllByRole(consumerTypeField, 'option')).toHaveLength(fakeConsumerTypes.length + 1);

      // select "Registro Federal de Contribuyentes" option
      await act(() => userEvent.selectOptions(consumerTypeField, RFC.key));
      consumerTypeField = await screen.findByLabelText(
        /checkoutProcessForm.payment_method.consumer_type/i,
      );
      expect(consumerTypeField.value).toBe(RFC.key);

      // RFC, rason social, cfdi, payment type and payment way are shown
      screen.getByLabelText(/RFC/i);
      screen.getByLabelText(/checkoutProcessForm.payment_method.business_name/i);
      screen.getByLabelText(/checkoutProcessForm.payment_method.cfdi/i);
      screen.getByLabelText(/checkoutProcessForm.payment_method.title/i);
      screen.getByLabelText(/checkoutProcessForm.payment_method.payment_way/i);
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.bank_name/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.bank_account/i),
      ).not.toBeInTheDocument();

      // select "TRANSFER" option
      let paymentWayField = screen.getByLabelText(
        /checkoutProcessForm.payment_method.payment_way/i,
      );
      await act(() => userEvent.selectOptions(paymentWayField, 'TRANSFER'));
      paymentWayField = await screen.findByLabelText(
        /checkoutProcessForm.payment_method.payment_way/i,
      );
      expect(paymentWayField.value).toBe('TRANSFER');

      // bank name & bank account fields are shown when "TRANSFER" is selected
      await screen.findByLabelText(/checkoutProcessForm.payment_method.bank_name/i);
      await screen.findByLabelText(/checkoutProcessForm.payment_method.bank_account/i);

      // select "CASH" option
      paymentWayField = screen.getByLabelText(/checkoutProcessForm.payment_method.payment_way/i);
      await act(() => userEvent.selectOptions(paymentWayField, 'CASH'));
      paymentWayField = await screen.findByLabelText(
        /checkoutProcessForm.payment_method.payment_way/i,
      );
      expect(paymentWayField.value).toBe('CASH');

      // bank name & bank account fields are not shown when payment way is not "TRANSFER"
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.bank_name/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.bank_account/i),
      ).not.toBeInTheDocument();
    });
  });
});
