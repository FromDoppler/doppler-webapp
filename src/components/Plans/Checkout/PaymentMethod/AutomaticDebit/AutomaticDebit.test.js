import { act, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import {
  fakeBillingInformation,
  fakePaymentMethodInformationWithAutomaticDebit,
} from '../../../../../services/doppler-billing-user-api-client.double';
import { fakeAccountPlanDiscounts } from '../../../../../services/doppler-account-plans-api-client.double';
import { fakeConsumerTypes } from '../../../../../services/static-data-client.double';
import { actionPage } from '../../Checkout';
import { Formik } from 'formik';
import { AutomaticDebit } from './AutomaticDebit';

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

const initialPropsReadonlyView = {
  optionView: actionPage.READONLY,
};

const AutomaticDebitElement = ({
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
          <Formik initialValues={{}}>
            <AutomaticDebit {...initialPropsReadonlyView} paymentMethod={paymentMethod} />
          </Formik>
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('Automatic debit component', () => {
  it('should show loading box while getting data', async () => {
    // Act
    render(
      <AutomaticDebitElement
        withError={false}
        updateView={actionPage.READONLY}
        paymentMethod={fakePaymentMethodInformationWithAutomaticDebit}
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
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    render(
      <AutomaticDebitElement
        withError={false}
        updateView={actionPage.READONLY}
        paymentMethod={fakePaymentMethodInformationWithAutomaticDebit}
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
        fakePaymentMethodInformationWithAutomaticDebit.identificationNumber,
      );
      expect(screen.getByRole('listitem', { name: 'resume data' })).toHaveTextContent(
        fakePaymentMethodInformationWithAutomaticDebit.razonSocial,
      );
    });
  });
});
