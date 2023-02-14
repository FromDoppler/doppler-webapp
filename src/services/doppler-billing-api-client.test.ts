import { AxiosStatic } from 'axios';
import { HttpDopplerBillingApiClient } from './doppler-billing-api-client';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';

function createHttpDopplerApiClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const connectionDataRef = {
    current: {
      status: 'authenticated',
      jwtToken: 'jwtToken',
      userData: { user: { email: 'email@mail.com' } } as DopplerLegacyUserData,
    },
  } as RefObject<AppSession>;
  const apiClient = new HttpDopplerBillingApiClient({
    axiosStatic,
    baseUrl: 'http://api.test',
    connectionDataRef,
  });
  return apiClient;
}

describe('HttpDopplerBillingApiClient', () => {
  it('should get invoices list correctly with "file" link', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T0:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [
            {
              rel: 'file',
              href: 'http://test.com/invoice_2020-09-29_10.pdf',
              description: 'Url to download invoice',
            },
          ],
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000002',
          date: '2020-09-30T0:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-30_10.pdf',
          _links: [
            {
              rel: 'file',
              href: 'http://test.com/invoice_2020-09-30_10.pdf',
              description: 'Url to download invoice',
            },
          ],
        },
      ],
      totalItems: 2,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(2);

    result.value.items.forEach((element: any) => {
      expect(element.downloadInvoiceUrl).not.toBe('');
    });
  });
});

describe('HttpDopplerBillingApiClient', () => {
  it('should get invoices list correctly without "file" link', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T0:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [
            {
              rel: 'Help',
              href: 'http://test.com/help',
              description: 'Url to download invoice',
            },
          ],
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000002',
          date: '2020-09-30T0:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-30_10.pdf',
          _links: [
            {
              rel: 'Help',
              href: 'http://test.com/help',
              description: 'Url to download invoice',
            },
          ],
        },
      ],
      totalItems: 2,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(2);

    result.value.items.forEach((element: any) => {
      expect(element.downloadInvoiceUrl).toBe('');
    });
  });
});

describe('HttpDopplerBillingApiClient', () => {
  it('should get invoices list correctly without links', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T0:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000002',
          date: '2020-09-30T0:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-30_10.pdf',
        },
      ],
      totalItems: 2,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(2);

    result.value.items.forEach((element: any) => {
      expect(element.downloadInvoiceUrl).toBe('');
    });
  });
});

describe('HttpDopplerBillingApiClient', () => {
  it('should get and error', async () => {
    // Arrange
    const request = jest.fn(async () => {});
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });
});

//With Creation date from API
describe('HttpDopplerBillingApiClient', () => {
  it('with "creationDate" property from API should get invoices list correctly with "creationDate" != null', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T00:00:00',
          creationDate: '2020-09-29T00:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [
            {
              rel: 'Help',
              href: 'http://test.com/help',
              description: 'Url to download invoice',
            },
          ],
        },
      ],
      totalItems: 1,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(1);

    result.value.items.forEach((element: any) => {
      expect(element.creationDate).toEqual(new Date('2020-09-29T00:00:00'));
    });
  });
});

describe('HttpDopplerBillingApiClient', () => {
  it('without "creationDate" property from API should get invoices list correctly with creationDate equal date', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T00:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [
            {
              rel: 'Help',
              href: 'http://test.com/help',
              description: 'Url to download invoice',
            },
          ],
        },
      ],
      totalItems: 1,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(1);
    expect(result.value.items[0].creationDate).toEqual(new Date(invoicesCollection.items[0].date));
  });
});

//With Due date from API
describe('HttpDopplerBillingApiClient', () => {
  it('with "dueDate" property from API should get invoices list correctly with "dueDate" != null', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T00:00:00',
          dueDate: '2020-09-29T00:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [
            {
              rel: 'Help',
              href: 'http://test.com/help',
              description: 'Url to download invoice',
            },
          ],
        },
      ],
      totalItems: 1,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(1);

    result.value.items.forEach((element: any) => {
      expect(element.dueDate).toEqual(new Date('2020-09-29T00:00:00'));
    });
  });
});

describe('HttpDopplerBillingApiClient', () => {
  it('without "dueDate" property from API should get invoices list correctly with dueDate equal null', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T00:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [
            {
              rel: 'Help',
              href: 'http://test.com/help',
              description: 'Url to download invoice',
            },
          ],
        },
      ],
      totalItems: 1,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(1);

    result.value.items.forEach((element: any) => {
      expect(element.dueDate).toEqual(null);
    });
  });
});

//With Paid to Date from API
describe('HttpDopplerBillingApiClient', () => {
  it('with "paidToDate" property from API should get invoices list correctly with "paidToDate" != 0', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T00:00:00',
          dueDate: '2020-09-29T00:00:00',
          currency: 'ARS',
          amount: 1500,
          paidToDate: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [
            {
              rel: 'Help',
              href: 'http://test.com/help',
              description: 'Url to download invoice',
            },
          ],
        },
      ],
      totalItems: 1,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(1);

    result.value.items.forEach((element: any) => {
      expect(element.paidToDate).toEqual(invoicesCollection.items[0].paidToDate);
    });
  });
});

describe('HttpDopplerBillingApiClient', () => {
  it('without "paidToDate" property from API should get invoices list correctly with paidToDate equal undefined', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T00:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [
            {
              rel: 'Help',
              href: 'http://test.com/help',
              description: 'Url to download invoice',
            },
          ],
        },
      ],
      totalItems: 1,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(1);

    result.value.items.forEach((element: any) => {
      expect(element.paidToDate).toBe(undefined);
    });
  });
});

//With Balance from API
describe('HttpDopplerBillingApiClient', () => {
  it('with "balance" property from API should get invoices list correctly with "balance" from API', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T00:00:00',
          dueDate: '2020-09-29T00:00:00',
          currency: 'ARS',
          amount: 1500,
          paidToDate: 1000,
          balance: 500,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [
            {
              rel: 'Help',
              href: 'http://test.com/help',
              description: 'Url to download invoice',
            },
          ],
        },
      ],
      totalItems: 1,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(1);

    result.value.items.forEach((element: any) => {
      expect(element.balance).toEqual(invoicesCollection.items[0].balance);
    });
  });
});

describe('HttpDopplerBillingApiClient', () => {
  it('without "balance" property from API should get invoices list correctly with the balance equal undefined', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          date: '2020-09-29T00:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [
            {
              rel: 'Help',
              href: 'http://test.com/help',
              description: 'Url to download invoice',
            },
          ],
        },
      ],
      totalItems: 1,
    };

    const listExist = {
      data: invoicesCollection,
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerBillingApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerBillingApiClient.getInvoices(0, 0);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(1);

    result.value.items.forEach((element: any) => {
      expect(element.balance).toBe(undefined);
    });
  });
});
