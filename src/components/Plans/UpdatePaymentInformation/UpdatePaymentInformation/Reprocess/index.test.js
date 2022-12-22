import { Reprocess } from './index';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { fakeInvoices } from '../../../../../services/doppler-billing-user-api-client.double';
import '@testing-library/jest-dom/extend-expect';

const dependencies = (withError, declinedInvoices, withFirstDataError, firstDataError) => ({
  dopplerBillingUserApiClient: {
    getInvoices: async (values) => {
      return !withError
        ? {
            success: true,
            value: declinedInvoices,
          }
        : { success: false };
    },
  },
});

const ReprocessElement = ({ withError, declinedInvoices, withFirstDataError, firstDataError }) => {
  const services = dependencies(withError, declinedInvoices, withFirstDataError, firstDataError);
  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <BrowserRouter>
          <Reprocess />
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('Reprocess component', () => {
  it('should show loading box while getting data', async () => {
    // Act
    render(<ReprocessElement withError={false} declinedInvoices={fakeInvoices} />);

    // // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);
  });

  it('should show the information', async () => {
    // Act
    render(<ReprocessElement withError={false} declinedInvoices={fakeInvoices} />);

    // // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    // Assert
    expect(screen.getByRole('alert', { name: 'pending-ammount' })).toHaveTextContent(
      `updatePaymentMethod.reprocess.pending_amount_message : US$ ${fakeInvoices.totalPending}`,
    );
    expect(screen.getAllByRole('row', { name: 'invoice' }).length).toBe(
      fakeInvoices.invoices.length,
    );
    expect(screen.getAllByText('updatePaymentMethod.reprocess.payment_now_button').length).toBe(1);
  });
});
