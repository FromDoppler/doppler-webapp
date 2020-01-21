import { AxiosStatic } from 'axios';
import { HttpDopplerApiClient } from './doppler-api-client';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';

const consoleError = console.error;

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

  describe('GetSubscriber', () => {
    it('should get and error', async () => {
      // Arrange
      const request = jest.fn(async () => {});
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscriber('test@test.com');

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(false);
    });

    it('should get a subscriber', async () => {
      // Arrange
      const subscriber = {
        data: {
          email: 'test@test.com',
          fields: [
            {
              name: 'test',
              value: 'test',
              predefined: true,
              private: true,
              readonly: true,
              type: 'boolean',
            },
          ],
          belongsToLists: ['list'],
          unsubscribedDate: '2019-11-27T18:05:40.847Z',
          unsubscriptionType: 'hardBounce',
          manualUnsubscriptionReason: 'administrative',
          unsubscriptionComment: 'test',
          status: 'active',
          score: 0,
        },
        status: 200,
      };
      const request = jest.fn(async () => subscriber);
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscriber('test@test.com');

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.value.email).toEqual('test@test.com');
    });

    it('should get a subscriber with unsubscribed by hard status', async () => {
      // Arrange
      const subscriber = {
        data: {
          email: 'test@test.com',
          fields: [],
          belongsToLists: [],
          unsubscribedDate: '2019-11-27T18:05:40.847Z',
          unsubscriptionType: 'hardBounce',
          manualUnsubscriptionReason: '',
          unsubscriptionComment: 'test',
          status: 'unsubscribed',
          score: 0,
        },
        status: 200,
      };
      const request = jest.fn(async () => subscriber);
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscriber('test@test.com');

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.value.status).toEqual('unsubscribed_by_hard');
    });

    it('should get a subscriber with unsubscribed by subscriber status', async () => {
      // Arrange
      const subscriber = {
        data: {
          email: 'test@test.com',
          fields: [],
          belongsToLists: [],
          unsubscribedDate: '2019-11-27T18:05:40.847Z',
          unsubscriptionType: 'internalPolicies',
          manualUnsubscriptionReason: '',
          unsubscriptionComment: 'test',
          status: 'unsubscribed',
          score: 0,
        },
        status: 200,
      };
      const request = jest.fn(async () => subscriber);
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscriber('test@test.com');

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.value.status).toEqual('unsubscribed_by_subscriber');
    });

    it('should get a subscriber with unsubscribed by client status', async () => {
      // Arrange
      const subscriber = {
        data: {
          email: 'test@test.com',
          fields: [],
          belongsToLists: [],
          unsubscribedDate: '2019-11-27T18:05:40.847Z',
          unsubscriptionType: 'manual',
          manualUnsubscriptionReason: 'administrative',
          unsubscriptionComment: 'test',
          status: 'unsubscribed',
          score: 0,
        },
        status: 200,
      };
      const request = jest.fn(async () => subscriber);
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscriber('test@test.com');

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.value.status).toEqual('unsubscribed_by_client');
    });
  });

  describe('GetCampaignsDelivery', () => {
    it('should get and error', async () => {
      // Arrange
      const request = jest.fn(async () => {});
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscriberSentCampaigns('test@test.com');

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(false);
    });

    it('should get a campaigns deliveries', async () => {
      // Arrange
      const campaignsDelivery = {
        data: {
          items: [
            {
              campaignId: 1,
              campaignName: 'Campaña estacional de primavera',
              campaignSubject: '¿Como sacarle provecho a la primavera?',
              deliveryStatus: 'opened',
              clicksCount: 2,
            },
            {
              campaignId: 2,
              campaignName: 'Campaña calendario estacional 2019',
              campaignSubject: 'El calendario estacional 2019 ya está aquí',
              deliveryStatus: 'opened',
              clicksCount: 23,
            },
          ],
          currentPage: 2,
          itemsCount: 2,
          pagesCount: 1,
        },
        status: 200,
      };
      const request = jest.fn(async () => campaignsDelivery);
      const dopplerApiClient = createHttpDopplerApiClient({ request });
      const campaignsPerPage = 5;
      const currentPage = 2;

      // Act
      const result = await dopplerApiClient.getSubscriberSentCampaigns(
        'test@test.com',
        campaignsPerPage,
        currentPage,
      );

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.value.pagesCount).toEqual(1);
      expect(result.value.items[0].campaignId).toEqual(1);
      expect(result.value.currentPage).toEqual(2);
    });
  });

  describe('GetSubscribers', () => {
    it('should get and error', async () => {
      // Arrange
      const request = jest.fn(async () => {});
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscribers('test@test.com');

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(false);
    });

    it('should get a subscribers', async () => {
      // Arrange
      const subscribers = {
        data: {
          items: [
            {
              email: 'test@fromdoppler.com',
              fields: [
                {
                  name: 'FIRSTNAME',
                  value: 'Manuel',
                  predefined: true,
                  private: false,
                  readonly: true,
                  type: 'string',
                },
                {
                  name: 'LASTNAME',
                  value: 'di Rago',
                  predefined: true,
                  private: false,
                  readonly: true,
                  type: 'string',
                },
              ],
              unsubscribedDate: '2019-11-27T18:05:40.847Z',
              unsubscriptionType: 'hardBounce',
              manualUnsubscriptionReason: 'administrative',
              unsubscriptionComment: 'test',
              status: 'active',
              score: 0,
            },
            {
              email: 'pepe@fromdoppler.com',
              fields: [
                {
                  name: 'FIRSTNAME',
                  value: 'Pepe',
                  predefined: true,
                  private: false,
                  readonly: true,
                  type: 'string',
                },
                {
                  name: 'LASTNAME',
                  value: 'Gonzales',
                  predefined: true,
                  private: false,
                  readonly: true,
                  type: 'string',
                },
              ],
              unsubscribedDate: '',
              unsubscriptionType: '',
              manualUnsubscriptionReason: '',
              unsubscriptionComment: '',
              status: 'active',
              score: 1,
            },
          ],
          currentPage: 0,
          itemsCount: 2,
          pagesCount: 1,
        },
      };
      const request = jest.fn(async () => subscribers);
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscribers('test@test.com');

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.value.pagesCount).toEqual(1);
      expect(result.value.items[0].email).toEqual('test@fromdoppler.com');
    });
  });
});
