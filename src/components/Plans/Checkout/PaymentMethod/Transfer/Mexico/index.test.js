import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TransferMexico } from '.';
import IntlProvider from '../../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../../services/pure-di';
import { Formik } from 'formik';

const fakePaymentMethod = {
  identificationNumber: 'fake RFC value',
  razonSocial: 'rason social',
  useCFDI: 'CAAR530917EV7',
  paymentType: 'PPD',
  paymentWay: 'TRANSFER',
  bankName: 'bank of america',
  bankAccount: '1234',
};

const fakeConsumerTypes = [{ key: 'RFC', value: 'Registro Federal de Contribuyentes' }];

const fakeCfdi = {
  G03: 'G03',
  P01: 'P01',
};

export const fakePaymentWays = {
  CASH: 'CASH',
  CHECK: 'CHECK',
  TRANSFER: 'TRANSFER',
};

export const fakePaymentTypes = [
  { key: 'PPD', value: 'PPD' },
  { key: 'PUE', value: 'PUE' },
];

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
  it('should render TransferMexico component when is readOnly', async () => {
    // Arrange
    const readOnly = true;

    // Act
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
    );

    // Assert
    expect(await screen.findByRole('listitem', { name: 'resume data' })).toBeInTheDocument();
    expect(screen.queryByRole('none', { name: 'transfer mexico fields' })).not.toBeInTheDocument();
  });

  it('should render TransferMexico component when is updated', async () => {
    // Arrange
    const readOnly = false;
    const RFC = fakeConsumerTypes[0];

    // Act
    render(
      <AppServicesProvider forcedServices={services}>
        <IntlProvider>
          <Formik initialValues={{}}>
            <TransferMexico
              readOnly={readOnly}
              paymentMethod={{}}
              consumerTypes={fakeConsumerTypes}
            />
          </Formik>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.queryByRole('listitem', { name: 'resume data' })).not.toBeInTheDocument();
    expect(await screen.findByRole('none', { name: 'transfer mexico fields' })).toBeInTheDocument();
  });
});
