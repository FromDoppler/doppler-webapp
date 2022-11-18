import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UpdatePaymentInformation from '.';
import {
  fakePaymentMethodInformation,
  fakePaymentMethodInformationWithTransfer,
} from '../../../../services/doppler-billing-user-api-client.double';

describe('UpdatePaymentInformation component', () => {
  const UpdatePaymentInformationElement = ({ dependencies }) => (
    <AppServicesProvider forcedServices={dependencies}>
      <IntlProvider>
        <MemoryRouter initialEntries={['/update-payment-method']}>
          <Routes>
            <Route path="/update-payment-method" element={<UpdatePaymentInformation />} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </AppServicesProvider>
  );

  it('should show payment method and reprocess header', async () => {
    // Arrange
    let result;

    const dependencies = {
      dopplerBillingUserApiClient: {
        getPaymentMethodData: async () => {
          return { success: true, value: fakePaymentMethodInformation };
        },
      },
    };

    result = render(<UpdatePaymentInformationElement dependencies={dependencies} />);

    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const { getAllByText } = result;

    // Assert
    expect(getAllByText('updatePaymentMethod.payment_method.title').length).toBe(2);
    expect(getAllByText('updatePaymentMethod.reprocess.title').length).toBe(1);
  });

  it('should show transfer message', async () => {
    // Arrange
    let result;

    const dependencies = {
      dopplerBillingUserApiClient: {
        getPaymentMethodData: async () => {
          return { success: true, value: fakePaymentMethodInformationWithTransfer };
        },
      },
    };

    result = render(<UpdatePaymentInformationElement dependencies={dependencies} />);

    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const { getAllByText } = result;

    // Assert
    expect(getAllByText('updatePaymentMethod.payment_method.transfer_message_line1').length).toBe(
      1,
    );
    expect(getAllByText('updatePaymentMethod.payment_method.transfer_message_line2').length).toBe(
      1,
    );
  });
});
