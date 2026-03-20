import { AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';
import { HttpDopplerConversationsApiClient } from './doppler-conversations-api-client';

const consoleError = console.error;
const jwtToken = 'jwtToken';
const accountEmail = 'email@mail.com';

function createHttpDopplerCoversationsApiClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const connectionDataRef = {
    current: {
      status: 'authenticated',
      jwtToken,
      userData: { user: { email: accountEmail } } as DopplerLegacyUserData,
    },
  } as RefObject<AppSession>;

  const apiClient = new HttpDopplerConversationsApiClient({
    axiosStatic,
    baseUrl: 'http://api.test',
    connectionDataRef,
  });
  return apiClient;
}

describe('HttpDopplerConversationsApiClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should get conversations information', async () => {
    // Arrange
    const paymentMethodInformation = {
      data: 5,
      status: 200,
    };
    const request = jest.fn(async () => paymentMethodInformation);
    const dopplerConversationsApiClient = createHttpDopplerCoversationsApiClient({ request });

    // Act
    const result = await dopplerConversationsApiClient.getConversations('', '');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail to get conversations information', async () => {
    // Arrange
    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerConversationsApiClient = createHttpDopplerCoversationsApiClient({ request });

    // Act
    const result = await dopplerConversationsApiClient.getConversations('', '');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });
});
