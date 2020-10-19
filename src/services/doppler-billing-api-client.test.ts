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
      userData: { user: { email: 'email@mail.com', idUser: '1000' } } as DopplerLegacyUserData,
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
          accountId: 'CD0000000073689',
          product: 'Prod 1',
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
          accountId: 'CD0000000073690',
          product: 'Prod 2',
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

    result.value.items.forEach((element) => {
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
          accountId: 'CD0000000073689',
          product: 'Prod 1',
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
          accountId: 'CD0000000073690',
          product: 'Prod 2',
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

    result.value.items.forEach((element) => {
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
          accountId: 'CD0000000073689',
          product: 'Prod 1',
          date: '2020-09-29T0:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-09-29_10.pdf',
        },
        {
          accountId: 'CD0000000073690',
          product: 'Prod 2',
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

    result.value.items.forEach((element) => {
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
          accountId: 'CD0000000073689',
          product: 'Prod 1',
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

    result.value.items.forEach((element) => {
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
          accountId: 'CD0000000073689',
          product: 'Prod 1',
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
          accountId: 'CD0000000073689',
          product: 'Prod 1',
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

    result.value.items.forEach((element) => {
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
          accountId: 'CD0000000073689',
          product: 'Prod 1',
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

    result.value.items.forEach((element) => {
      expect(element.dueDate).toEqual(null);
    });
  });
});
