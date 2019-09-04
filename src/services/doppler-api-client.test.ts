import { AxiosStatic } from 'axios';
import { HttpDopplerApiClient } from './doppler-api-client';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';
import { ExperimentalFeatures } from './experimental-features';
import { FakeLocalStorage } from './test-utils/local-storage-double';

const consoleError = console.error;

function createHttpDopplerApiClient(axios: any, experimentalFeatures?: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const connectionDataRef = {
    current: {
      status: 'authenticated',
      jwtToken: 'jwtToken',
      userData: { user: { email: 'email@mail.com' } } as DopplerLegacyUserData,
      experimentalFeatures: experimentalFeatures,
    },
  } as RefObject<AppSession>;
  const apiClient = new HttpDopplerApiClient({
    axiosStatic,
    baseUrl: 'http://api.test',
    connectionDataRef,
  });
  return apiClient;
}

describe('HttpDopplerApiClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should set get subscriber amount from list correctly', async () => {
    // Arrange
    const listExist = {
      data: {
        listId: 27311899,
        name: 'Shopify Contacto',
        currentStatus: 'ready',
        subscribersCount: 3,
        creationDate: '2019-05-30T11:47:45.367Z',
      },
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerApiClient.getListData(27311899);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.amountSubscribers).not.toBe(undefined);
  });

  it('should set throw error when list does not exist', async () => {
    // Arrange
    const listNotExist = {
      data: {},
      status: 400,
      statusText: 'Error',
    };
    const request = jest.fn(async () => listNotExist);
    const dopplerApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerApiClient.getListData(27311899);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  it('should set get subscriber amount from list correctly with apikey injected', async () => {
    // Arrange
    const listExist = {
      data: {
        listId: 27311899,
        name: 'Shopify Contacto',
        currentStatus: 'ready',
        subscribersCount: 3,
        creationDate: '2019-05-30T11:47:45.367Z',
      },
      status: 200,
    };

    const experimentalFeaturesData = {
      DopplerAPI: { apikey: 'myapikey', listId: 455222 },
    };
    const storage = new FakeLocalStorage();
    storage.setItem('dopplerExperimental', JSON.stringify(experimentalFeaturesData));
    const experimentalFeatures = new ExperimentalFeatures(storage);

    const request = jest.fn(async () => listExist);
    const dopplerApiClient = createHttpDopplerApiClient({ request }, experimentalFeatures);

    // Act
    const result = await dopplerApiClient.getListData(27311899);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
  });
});
