import React from 'react';
import { render, cleanup, waitFor, fireEvent, getByText } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import Checkout from './Checkout';
import {
  fakeIndustries,
  fakeQuestions,
  fakeStates,
} from '../../../services/static-data-client.double';

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
  };

  const CheckoutElement = () => (
    <AppServicesProvider forcedServices={dependencies}>
      <IntlProvider>
        <BrowserRouter>
          <Checkout />
        </BrowserRouter>
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

  it('should show contact information, billing information and payment method header', async () => {
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
  });
});
