import React from 'react';
import { render, cleanup, waitFor, getByTitle } from '@testing-library/react';
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
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          creationDate: new Date('2020-09-25T00:00:00'),
          dueDate: new Date('2020-09-25T00:00:00'),
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-05_10.pdf',
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000002',
          creationDate: new Date('2020-09-25T00:00:00'),
          dueDate: new Date('2020-09-25T00:00:00'),
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
    await waitFor(() => expect(getByText('A-0001-00000001')).toBeInTheDocument());
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

  it('should shows a link when the download url is not empty', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          creationDate: new Date('2020-09-25T00:00:00'),
          dueDate: new Date('2020-09-25T00:00:00'),
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-05_10.pdf',
          downloadInvoiceUrl: 'http://test.com/invoice_2020-10-05_10.pdf',
        },
      ],
      totalItems: 1,
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
    await waitFor(() => expect(getByText('invoices_list.download_msg')).toBeInTheDocument());
  });

  it('should shows a message when the download url is empty', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          creationDate: new Date('2020-09-25T00:00:00'),
          dueDate: new Date('2020-09-25T00:00:00'),
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-05_10.pdf',
          downloadInvoiceUrl: '',
        },
      ],
      totalItems: 1,
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
    await waitFor(() => expect(getByText('invoices_list.no_download_msg')).toBeInTheDocument());
  });

  it('should show a pagination when there are invoices', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          creationDate: new Date('2020-09-25T00:00:00'),
          dueDate: new Date('2020-09-25T00:00:00'),
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-05_10.pdf',
          downloadInvoiceUrl: '',
        },
      ],
      totalItems: 1,
    };

    const dopplerBillingApiClientDouble = {
      getInvoices: async () => {
        return { success: true, value: invoicesCollection };
      },
    };

    // Act
    const { container } = render(
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
    await waitFor(() => {
      expect(container.querySelector('.dp-pagination')).toBeInTheDocument();
    });
  });

  it('should not show pagination when there are no invoices', async () => {
    // Arrange
    const invoicesCollection = {
      items: [],
      totalItems: 0,
    };

    const dopplerBillingApiClientDouble = {
      getInvoices: async () => {
        return { success: true, value: invoicesCollection };
      },
    };

    // Act
    const { container } = render(
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
    await waitFor(() => {
      expect(container.querySelector('.dp-pagination')).not.toBeInTheDocument();
    });
  });

  it('should not show pagination when the service throws an error', async () => {
    // Arrange
    const invoicesCollection = {
      items: [],
      totalItems: 0,
    };

    const dopplerBillingApiClientDouble = {
      getInvoices: async () => {
        return { success: false, value: invoicesCollection };
      },
    };

    // Act
    const { container } = render(
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
    await waitFor(() => {
      expect(container.querySelector('.dp-pagination')).not.toBeInTheDocument();
    });
  });

  it('should show an "invoice_text" when DocumentType equal "FC"', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          creationDate: new Date('2020-09-25T00:00:00'),
          dueDate: new Date('2020-09-25T00:00:00'),
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-05_10.pdf',
          downloadInvoiceUrl: '',
        },
      ],
      totalItems: 1,
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
    await waitFor(() => expect(getByText('invoices_list.document_FC')).toBeInTheDocument());
  });

  it('should show a "credit_note_text" when DocumentType is not "FC"', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'NC',
          documentNumber: 'A-0001-00000001',
          creationDate: new Date('2020-09-25T00:00:00'),
          dueDate: new Date('2020-09-25T00:00:00'),
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-05_10.pdf',
          downloadInvoiceUrl: '',
        },
      ],
      totalItems: 1,
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
    await waitFor(() => expect(getByText('invoices_list.document_NC')).toBeInTheDocument());
  });
});
