import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Checkout from './Checkout';
import {
  fakeIndustries,
  fakeQuestions,
  fakeStates,
} from '../../../services/static-data-client.double';
import {
  fakePlan,
  fakePlanAmountDetails,
} from '../../../services/doppler-account-plans-api-client.double';
import {
  fakeInvoiceRecipients,
  fakePaymentMethodInformation,
} from '../../../services/doppler-billing-user-api-client.double';
import { fakeAccountPlanDiscounts } from '../../../services/doppler-account-plans-api-client.double';

describe('Checkout component', () => {
  const contactInformation = {
    email: 'test@makingsense.com',
    firstname: 'Juan',
    lastname: 'Perez',
    address: 'Alem 1234',
    city: 'Tandil',
    province: 'Buenos Aires',
    countryId: 1,
    zipCode: '7000',
    phone: '+542494228090',
    company: 'Test',
    industry: 'IT',
  };

  const dependencies = {
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
    dopplerUserApiClient: {
      getContactInformationData: async () => {
        return { success: true, value: contactInformation };
      },
      createOrUpdateContactInformation: async () => {
        return { success: true };
      },
    },
    staticDataClient: {
      getIndustriesData: async (language) => ({ success: true, value: fakeIndustries }),
      getStatesData: async (country, language) => ({ success: true, value: fakeStates }),
      getSecurityQuestionsData: async (language) => ({ success: true, value: fakeQuestions }),
    },
    dopplerBillingUserApiClient: {
      getPaymentMethodData: async () => {
        return { success: true, value: fakePaymentMethodInformation };
      },
      getInvoiceRecipientsData: async () => {
        return { success: true, value: fakeInvoiceRecipients };
      },
      updateInvoiceRecipients: async () => {
        return { success: true };
      },
      updatePurchaseIntention: async () => {
        return { success: true };
      },
    },
    dopplerAccountPlansApiClient: {
      getDiscountsData: async () => {
        return { success: true, value: fakeAccountPlanDiscounts };
      },
      getPlanData: async () => {
        return { success: true, value: fakePlan };
      },
      getPlanAmountDetailsData: async () => {
        return { success: true, value: fakePlanAmountDetails };
      },
    },
  };

  const CheckoutElement = () => (
    <AppServicesProvider forcedServices={dependencies}>
      <IntlProvider>
        <MemoryRouter initialEntries={['/checkout/standard/subscribers']}>
          <Routes>
            <Route path="/checkout/:pathType/:planType" element={<Checkout />} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </AppServicesProvider>
  );

  it('should show contact information', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { getAllByText } = result;

    // Assert
    expect(getAllByText('checkoutProcessForm.contact_information_title').length).toBe(2);
  });

  it('should show contact information, billing information, payment method and purchase summary header', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { getAllByText } = result;

    // Assert
    expect(getAllByText('checkoutProcessForm.contact_information_title').length).toBe(2);
    expect(getAllByText('checkoutProcessForm.billing_information_title').length).toBe(1);
    expect(getAllByText('checkoutProcessForm.payment_method.title').length).toBe(1);
    expect(getAllByText('Resumen de compra').length).toBe(1);
  });
});
