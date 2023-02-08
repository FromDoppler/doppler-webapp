import { act, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { Transfer } from './Transfer';
import {
  fakeBillingInformation,
  fakePaymentMethodInformationWithTransfer,
} from '../../../../../services/doppler-billing-user-api-client.double';
import { fakeAccountPlanDiscounts } from '../../../../../services/doppler-account-plans-api-client.double';
import { fakeConsumerTypes } from '../../../../../services/static-data-client.double';
import { actionPage } from '../../Checkout';
import { Formik } from 'formik';

const getFormFields = (isFinalConsumer) => {
  let selectConsumerTypes;
  let inputIdentificationNumber;
  let inputBusinessName;

  selectConsumerTypes = screen.getByRole('combobox', {
    name: '*checkoutProcessForm.payment_method.consumer_type',
  });
  inputIdentificationNumber = screen.getByRole('textbox', {
    name: 'identificationNumber',
  });

  if (!isFinalConsumer) {
    inputBusinessName = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.payment_method.business_name',
    });
  }

  return {
    selectConsumerTypes,
    inputIdentificationNumber,
    inputBusinessName,
  };
};

const dependencies = (
  withError,
  dopplerAccountPlansApiClientDouble,
  dopplerBillingUserApiClientDouble,
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
  staticDataClient: {
    getConsumerTypesData: async (country, language) => ({
      success: true,
      value: fakeConsumerTypes,
    }),
  },
  dopplerBillingUserApiClient: dopplerBillingUserApiClientDouble,
  dopplerAccountPlansApiClient: dopplerAccountPlansApiClientDouble,
});

const dopplerAccountPlansApiClientDoubleBase = {
  getDiscountsData: async () => {
    return { success: true, value: fakeAccountPlanDiscounts };
  },
};

const dopplerBillingUserApiClientDoubleBase = {
  getBillingInformationData: async () => {
    return { success: true, value: fakeBillingInformation };
  },
};

const initialPropsReonlyView = {
  optionView: actionPage.READONLY,
};

const initialPropsUpdateView = {
  optionView: actionPage.UPDATE,
};

const TransferElement = ({
  withError,
  updateView,
  paymentMethod,
  dopplerAccountPlansApiClientDouble,
  dopplerBillingUserApiClientDouble,
}) => {
  const services = dependencies(
    withError,
    dopplerAccountPlansApiClientDouble,
    dopplerBillingUserApiClientDouble,
  );
  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <BrowserRouter>
          {updateView === actionPage.UPDATE ? (
            <Formik initialValues={{}}>
              <Transfer {...initialPropsUpdateView} paymentMethod={paymentMethod} />
            </Formik>
          ) : (
            <Formik initialValues={{}}>
              <Transfer {...initialPropsReonlyView} paymentMethod={paymentMethod} />
            </Formik>
          )}
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('Transfer component', () => {
  it('should show loading box while getting data', async () => {
    // Act
    render(
      <TransferElement
        withError={false}
        updateView={actionPage.READONLY}
        paymentMethod={fakePaymentMethodInformationWithTransfer}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDoubleBase}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    await waitFor(async () => {
      // Loader should disappear once request resolves
      const loader = screen.getByTestId('wrapper-loading');
      await waitForElementToBeRemoved(loader);
    });
  });

  it('should show the correct data in readonly view', async () => {
    // Act
    render(
      <TransferElement
        withError={false}
        updateView={actionPage.READONLY}
        paymentMethod={fakePaymentMethodInformationWithTransfer}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDoubleBase}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await waitFor(async () => {
      expect(screen.getByRole('listitem', { name: 'resume data' })).toHaveTextContent('DNI');
      expect(screen.getByRole('listitem', { name: 'resume data' })).toHaveTextContent(
        fakePaymentMethodInformationWithTransfer.identificationNumber,
      );
    });
  });

  // describe.each([
  //   [
  //     'should show the correct data when the user is "Consumidor Final" in update view',
  //     'CF',
  //     '12345678',
  //     '',
  //     true,
  //   ],
  //   [
  //     'should show the correct data when the user is "Responsable Inscripto" in update view',
  //     'RI',
  //     '20-11111111-1',
  //     'Company Test',
  //     false,
  //   ],
  // ])(
  //   'transfer payment method',
  //   (testName, idConsumerType, identificationNumber, businessName, isFinalConsumer) => {
  //     it(testName, async () => {
  //       //Arrange
  //       const fakeTransferInformation = {
  //         paymentMethodName: 'TRANSF',
  //         razonSocial: businessName,
  //         idConsumerType: idConsumerType,
  //         identificationNumber: identificationNumber,
  //       };

  //       // Act
  //       render(
  //         <TransferElement
  //           withError={false}
  //           updateView={actionPage.UPDATE}
  //           paymentMethod={fakeTransferInformation}
  //           dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDoubleBase}
  //           dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
  //         />,
  //       );

  //       // Loader should disappear once request resolves
  //       const loader = screen.getByTestId('wrapper-loading');
  //       await waitForElementToBeRemoved(loader);

  //       const { selectConsumerTypes, inputIdentificationNumber, inputBusinessName } =
  //         getFormFields(isFinalConsumer);

  //       expect(selectConsumerTypes).toHaveValue(fakeTransferInformation.idConsumerType);

  //       expect(inputIdentificationNumber).toHaveValue(fakeTransferInformation.identificationNumber);

  //       if (isFinalConsumer) {
  //         expect(inputBusinessName).toBeUndefined();
  //       } else {
  //         expect(inputBusinessName).toHaveValue(fakeTransferInformation.razonSocial);
  //       }
  //     });
  //   },
  // );
});
