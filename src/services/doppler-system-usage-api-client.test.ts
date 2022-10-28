import { HttpDopplerSystemUsageApiClient } from './doppler-system-usage-api-client';
import { AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';

const consoleError = console.error;

function createHttpSystemUsageClient(axios: any) {
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
  const systemUsageClient = new HttpDopplerSystemUsageApiClient({
    axiosStatic,
    baseUrl: 'http://doppler-system-usage.test',
    connectionDataRef,
  });
  return systemUsageClient;
}

describe('HttpDopplerSystemUsageApiClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should execute getUserSystemUsage', async () => {
    // Arrange
    const userSystemUsage = {
      headers: {},
      status: 200,
      data: { email: 'mail@makingsense.com', reportsSectionLastVisit: '2022-10-25T13:39:34.707Z' },
    };
    const request = jest.fn(async () => userSystemUsage);
    const systemUsageClient = createHttpSystemUsageClient({ request });

    // Act
    const result = await systemUsageClient.getUserSystemUsage();

    // Assert
    expect(request).toBeCalled();
    expect(result.success).toBe(true);
    expect(result.value).toEqual(userSystemUsage.data);
  });
});
