import { AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';
import { HttpBigQueryClient } from './big-query-client';

const consoleError = console.error;

function createHttpBigQueryClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const connectionDataRef = {
    current: {
      status: 'authenticated',
      jwtToken: 'jwtToken',
      userData: {} as DopplerLegacyUserData,
    },
  } as RefObject<AppSession>;
  const bigQueryClient = new HttpBigQueryClient({
    axiosStatic,
    baseUrl: 'http://bigquery.test',
    connectionDataRef,
  });
  return bigQueryClient;
}

describe('HttpBigQueryClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should get emails by user id', async () => {
    // Arrange
    const emails = {
      headers: {},
      data: { emails: ['', 'correo2@gmail.com'] },
    };
    const request = jest.fn(async () => emails);
    const bigQueryClient = createHttpBigQueryClient({ request });

    // Act
    const result = await bigQueryClient.getEmailsData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value?.emails[0]).toEqual(emails.data.emails[0]);
  });
});
