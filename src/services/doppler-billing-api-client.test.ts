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
  it('should get invoices list correctly', async () => {
    // Arrange
    const invoicesCollection = {
      items: [
        {
          accountId: 'CD0000000073689',
          product: 'Prod 1',
          date: '2020-09-29T0:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-05_10.pdf',
        },
        {
          accountId: 'CD0000000073690',
          product: 'Prod 2',
          date: '2020-09-30T0:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-05_10.pdf',
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

    console.log(result);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.items).not.toBe(undefined);
    expect(result.value.totalItems).toBe(2);
  });

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
