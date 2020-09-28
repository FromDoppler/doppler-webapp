import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import InvoicesList from './InvoicesList';

describe('InvoiceList component', () => {
  afterEach(cleanup);

  it('should show invocies', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          accountId: 'CD0000000073689',
          product: 'Prod 1',
          date: new Date('2020-09-25T00:00:00'),
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-05_10.pdf',
        },
        {
          accountId: 'CD0000000073690',
          product: 'Prod 2',
          date: new Date('2020-09-26T00:00:00'),
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-05_10.pdf',
        },
      ],
      totalItems: 2,
    };

    const dopplerBillingApiClientDouble = {
      getInvoices: async () => {
        return { success: true, value: invoicesCollection };
      },
    };

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerBillingApiClient: dopplerBillingApiClientDouble,
        }}
      >
        <IntlProvider>
          <BrowserRouter>
            <InvoicesList />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await waitFor(() => expect(getByText('CD0000000073689')).toBeInTheDocument());
  });

  it('should show empty message', async () => {
    // Arrange
    const emptyCollection = { items: [], totalItems: 0 };
    const dopplerBillingApiClientDouble = {
      getInvoices: async () => {
        return { success: true, value: emptyCollection };
      },
    };

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerBillingApiClient: dopplerBillingApiClientDouble,
        }}
      >
        <IntlProvider>
          <BrowserRouter>
            <InvoicesList />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() => expect(getByText('invoices_list.no_data_msg')).toBeInTheDocument());
  });

  it('should show error message when the billing api throws an error', async () => {
    // Arrange
    const emptyCollection = { items: [], totalItems: 0 };
    const dopplerBillingApiClientDouble = {
      getInvoices: async () => {
        return { success: false, value: emptyCollection };
      },
    };

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerBillingApiClient: dopplerBillingApiClientDouble,
        }}
      >
        <IntlProvider>
          <BrowserRouter>
            <InvoicesList />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() => expect(getByText('invoices_list.error_msg')).toBeInTheDocument());
  });
});
