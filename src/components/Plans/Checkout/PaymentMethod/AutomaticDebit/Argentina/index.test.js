import { getAllByRole, getByText, render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AutomaticDebitArgentina } from '.';
import IntlProvider from '../../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { Formik } from 'formik';
import { finalConsumer } from '../../Transfer/Transfer';
import userEvent from '@testing-library/user-event';
import { fakePaymentMethodInformationWithAutomaticDebit } from '../../../../../../services/doppler-billing-user-api-client.double';

describe('AutomaticDebitArgentina', () => {
  it('should render the resume data when is read only mode', async () => {
    // Arrange
    const readOnly = true;
    const fakePaymentMethod = {
      idConsumerType: finalConsumer,
      identificationNumber: '81544670',
      razonSocial: 'Boris Marketing',
    };

    // Act
    await act(() =>
      render(
        <IntlProvider>
          <Formik initialValues={{}}>
            <AutomaticDebitArgentina
              readOnly={readOnly}
              paymentMethod={fakePaymentMethod}
              consumerTypes={null}
            />
          </Formik>
        </IntlProvider>,
      ),
    );

    // Assert
    const resumeData = await screen.findByRole('listitem', { name: 'resume data' });
    getByText(resumeData, /81544670/i);
    getByText(resumeData, /Boris Marketing/i);

    expect(
      screen.queryByRole('tabpanel', { name: 'automatic debit argentina fields' }),
    ).not.toBeInTheDocument();
  });

  describe('should render AutomaticDebitArgentina component when is edit mode', () => {
    // Arrange
    const readOnly = false;
    const fakePaymentMethod = {
      idConsumerType: '',
      identificationNumber: '',
      razonSocial: '',
    };
    const fakeConsumerTypes = [
      {
        key: 'CF',
        value: 'Consumidor Final',
      },
      {
        key: 'EX',
        value: 'Exento',
      },
      {
        key: 'MT',
        value: 'Monotributo',
      },
      {
        key: 'NC',
        value: 'No Categorizado',
      },
      {
        key: 'NG',
        value: 'No Gravado',
      },
      {
        key: 'RI',
        value: 'Responsable Inscripto',
      },
      {
        key: 'RNI',
        value: 'Responsable No Inscripto',
      },
    ];

    it('should render the automatic debit argentina form', async () => {
      // Act
      await act(() =>
        render(
          <IntlProvider>
            <Formik initialValues={{}}>
              <AutomaticDebitArgentina
                readOnly={readOnly}
                paymentMethod={fakePaymentMethod}
                consumerTypes={fakeConsumerTypes}
              />
            </Formik>
          </IntlProvider>,
        ),
      );

      // Assert
      await screen.findByRole('tabpanel', { name: 'automatic debit argentina fields' });

      // resume data is not visible when is edit mode
      expect(screen.queryByRole('listitem', { name: 'resume data' })).not.toBeInTheDocument();
    });

    it('should render the automatic debit argentina form with the correct fields', async () => {
      // Act
      render(
        <IntlProvider>
          <Formik initialValues={{}}>
            <AutomaticDebitArgentina
              readOnly={readOnly}
              paymentMethod={fakePaymentMethod}
              consumerTypes={fakeConsumerTypes}
            />
          </Formik>
        </IntlProvider>,
      );

      // Assert
      const getWithHoldingAgentCheckbox = () =>
        screen.getByLabelText(/checkoutProcessForm.payment_method.withholding_agent/i);
      let withHoldingAgentCheckbox = getWithHoldingAgentCheckbox();

      // Initially, DNI & rason social & CBU fields are not in the document
      expect(screen.queryByLabelText(/DNI/i)).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.business_name/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/checkoutProcessForm.payment_method.cbu/i),
      ).not.toBeInTheDocument();

      //Check withholding agent checkbox
      await act(() => userEvent.click(withHoldingAgentCheckbox));

      const getConsumerTypeField = () => screen.getByRole('combobox');
      let consumerTypeField = getConsumerTypeField();

      // +1 because default option is included
      expect(getAllByRole(consumerTypeField, 'option')).toHaveLength(fakeConsumerTypes.length + 1);

      // select "Responsable Inscripto" option
      await act(() => userEvent.selectOptions(consumerTypeField, 'RI'));
      consumerTypeField = await screen.findByRole('combobox');
      expect(consumerTypeField.value).toBe('RI');

      // CUIT & rason social & CBU fields are shown when consumer type is selected
      screen.getByLabelText(/CUIT/i);
      screen.getByLabelText(/checkoutProcessForm.payment_method.business_name/i);
      screen.queryByLabelText(/checkoutProcessForm.payment_method.cbu/i);

      // DNI field is not shown when consumer type is not final consumer
      expect(screen.queryByLabelText(/DNI/i)).not.toBeInTheDocument();

      // select "Consumidor Final" option
      await act(() => userEvent.selectOptions(consumerTypeField, finalConsumer));
      consumerTypeField = await screen.findByRole('combobox');
      expect(consumerTypeField.value).toBe(finalConsumer);

      // DNI field is shown because consumer type is final consumer
      screen.getByLabelText(/DNI/i);

      // fill DNI, rason social and CBU
      await act(() => userEvent.type(screen.getByLabelText(/DNI/i), '81544670'));
      await act(() =>
        userEvent.type(
          screen.getByLabelText(/checkoutProcessForm.payment_method.first_last_name/i),
          'Boris Marketing',
        ),
      );
      await act(() =>
        userEvent.type(
          screen.getByLabelText(/checkoutProcessForm.payment_method.cbu/i),
          fakePaymentMethodInformationWithAutomaticDebit.cbu,
        ),
      );

      expect(await screen.findByLabelText(/DNI/i)).toHaveValue(81544670);
      expect(
        await screen.findByLabelText(/checkoutProcessForm.payment_method.first_last_name/i),
      ).toHaveValue('Boris Marketing');
      expect(await screen.findByLabelText(/checkoutProcessForm.payment_method.cbu/i)).toHaveValue(
        fakePaymentMethodInformationWithAutomaticDebit.cbu,
      );
    });
  });
});
