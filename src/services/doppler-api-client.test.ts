import { AxiosStatic } from 'axios';
import { HttpDopplerApiClient } from './doppler-api-client';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';
import { SubscriberListState } from './shopify-client';

const consoleError = console.error;
const jwtToken = 'jwtToken';
const accountEmail = 'email@mail.com';

function createHttpDopplerApiClient(axios: any) {
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
    expect(result.success && result.value.amountSubscribers).not.toBe(undefined);
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
      expect(result.success && result.value.email).toEqual('test@test.com');
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
      expect(result.success && result.value.status).toEqual('unsubscribed_by_hard');
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
      expect(result.success && result.value.status).toEqual('unsubscribed_by_subscriber');
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
      expect(result.success && result.value.status).toEqual('unsubscribed_by_client');
    });

    it('should get a subscriber correctly with permission history download link', async () => {
      // Arrange
      const subscriber = {
        data: {
          email: 'test@test.com',
          fields: [],
          belongsToLists: [],
          unsubscribedDate: '2019-11-27T18:05:40.847Z',
          unsubscriptionType: 'hardBounce',
          manualUnsubscriptionReason: 'administrative',
          unsubscriptionComment: 'test',
          status: 'active',
          score: 0,
          _links: [
            {
              href: 'permissions-history.csv',
              description: "Get subscriber's complete permission history as CSV",
              rel: '/docs/rels/get-permission-history-csv',
            },
          ],
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
      expect(result.value).not.toBe(undefined);
      expect(result.value.downloadPermissionHistoryUrl).toBe('permissions-history.csv');
    });

    it('should get a subscriber correctly without permission history download link', async () => {
      // Arrange
      const subscriber = {
        data: {
          email: 'test@test.com',
          fields: [],
          belongsToLists: [],
          unsubscribedDate: '2019-11-27T18:05:40.847Z',
          unsubscriptionType: 'hardBounce',
          manualUnsubscriptionReason: 'administrative',
          unsubscriptionComment: 'test',
          status: 'active',
          score: 0,
          _links: [
            {
              href: '/accounts/test@test.com',
              description: 'Get account home.',
              rel: '/docs/rels/get-account-home',
            },
          ],
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
      expect(result.value).not.toBe(undefined);
      expect(result.value.downloadPermissionHistoryUrl).toBe('');
    });

    it('should get a subscriber correctly without links', async () => {
      // Arrange
      const subscriber = {
        data: {
          email: 'test@test.com',
          fields: [],
          belongsToLists: [],
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
      expect(result.value).not.toBe(undefined);
      expect(result.value.downloadPermissionHistoryUrl).toBe('');
    });
  });

  describe('GetCampaignsDelivery', () => {
    it('should get and error', async () => {
      // Arrange
      const request = jest.fn(async () => {});
      const dopplerApiClient = createHttpDopplerApiClient({ request });
      const campaignsPerPage = 10;
      const currentPage = 1;

      // Act
      const result = await dopplerApiClient.getSubscriberSentCampaigns(
        'test@test.com',
        campaignsPerPage,
        currentPage,
      );

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
              isSendingNow: false,
              _links: [],
            },
            {
              campaignId: 2,
              campaignName: 'Campaña calendario estacional 2019',
              campaignSubject: 'El calendario estacional 2019 ya está aquí',
              deliveryStatus: 'opened',
              clicksCount: 23,
              isSendingNow: false,
              _links: [],
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
      expect(result.success && result.value.pagesCount).toEqual(1);
      expect(result.success && result.value.items[0].campaignId).toEqual(1);
      expect(result.success && result.value.currentPage).toEqual(2);
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
              belongsToLists: [],
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
              belongsToLists: [],
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
      expect(result.success && result.value.pagesCount).toEqual(1);
      expect(result.success && result.value.items[0].email).toEqual('test@fromdoppler.com');
    });
  });

  describe('GetCampaignsSummaryResults', () => {
    it('should get and error', async () => {
      // Arrange
      const request = jest.fn(async () => {});
      const dopplerApiClient = createHttpDopplerApiClient({ request });
      const campaignId = 123321;

      // Act
      const result = await dopplerApiClient.getCampaignSummaryResults(campaignId);

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(false);
    });

    it('should get correct data', async () => {
      // Arrange
      const campaignSummaryResults = {
        data: {
          totalRecipients: 500,
          successFullDeliveries: 20,
          timesForwarded: 0,
          totalTimesOpened: 2,
          lastOpenDate: '2019-11-27T18:05:40.847Z',
          uniqueClicks: 3,
          uniqueOpens: 3,
          totalUnopened: 24,
          totalHardBounces: 0,
          totalSoftBounces: 0,
          totalClicks: 2,
          lastClickDate: '2019-11-27T18:05:40.847Z',
          totalUnsubscribers: 5,
          campaignStatus: 'shipping',
          totalShipped: 50,
        },
      };
      const request = jest.fn(async () => campaignSummaryResults);
      const dopplerApiClient = createHttpDopplerApiClient({ request });
      const campaignId = 123321;

      // Act
      const result = await dopplerApiClient.getCampaignSummaryResults(campaignId);

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.success && result.value.totalRecipients).toEqual(500);
      expect(result.success && result.value.campaignStatus).toEqual('shipping');
    });
  });

  describe('GetCampaignNameAndSubject', () => {
    it('should get and error', async () => {
      // Arrange
      const request = jest.fn(async () => {});
      const dopplerApiClient = createHttpDopplerApiClient({ request });
      const campaignId = 123321;

      // Act
      const result = await dopplerApiClient.getCampaignNameAndSubject(campaignId);

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(false);
    });

    it('should get correct data', async () => {
      // Arrange
      const campaignSummaryResults = {
        data: {
          name: 'Campaign test',
          subject: 'Subject test',
        },
      };
      const request = jest.fn(async () => campaignSummaryResults);
      const dopplerApiClient = createHttpDopplerApiClient({ request });
      const campaignId = 123321;

      // Act
      const result = await dopplerApiClient.getCampaignNameAndSubject(campaignId);

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.success && result.value.name).toEqual('Campaign test');
      expect(result.success && result.value.subject).toEqual('Subject test');
    });
  });

  describe('getUserFields', () => {
    it('should get and error', async () => {
      // Arrange
      const request = jest.fn(async () => {});
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getUserFields();

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(false);
    });

    it('should get correct data', async () => {
      // Arrange
      const fieldsResult = {
        data: {
          items: [
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
          _links: [],
        },
      };
      const request = jest.fn(async () => fieldsResult);
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getUserFields();

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.success && result.value).not.toBe(null);
    });
  });

  describe('getSubscriberPermissionHistory', () => {
    it('should get an error when the response is not valid', async () => {
      // Arrange
      const request = jest.fn(async () => {}); // Invalid response
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscriberPermissionHistory({
        subscriberEmail: 'a@a.com',
        fieldName: 'MiPermiso',
      });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(false);
    });

    it('should call API with the right parameters and parse a successful response', async () => {
      // Arrange
      const subscriberEmail = 'a@a.com';
      const fieldName = 'MiPermiso';
      const httpResponseBody = {
        data: {
          items: [
            {
              subscriberEmail,
              fieldName,
              fieldType: 'permission',
              date: '2021-02-10T15:22:00.000Z',
              value: 'true',
              originIP: '181.167.226.47',
              originType: 'Formulario',
            },
            {
              subscriberEmail,
              fieldName,
              fieldType: 'permission',
              date: '2021-02-05T10:11:24.000Z',
              value: 'true',
              originIP: '181.167.226.30',
              originType: 'Formulario',
            },
            {
              subscriberEmail,
              fieldName,
              fieldType: 'permission',
              date: '2021-01-05T01:05:04.123Z',
              value: 'true',
              originIP: '181.167.226.20',
              originType: 'Manual',
            },
          ],
          currentPage: 1,
          itemsCount: 3,
          pagesCount: 1,
          _links: [],
        },
      };
      const request = jest.fn(async () => httpResponseBody);
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscriberPermissionHistory({
        subscriberEmail,
        fieldName,
      });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith({
        headers: {
          Authorization: `token ${jwtToken}`,
        },
        method: 'GET',
        url: `/accounts/${accountEmail}/subscribers/${subscriberEmail}/permissions-history/${fieldName}`,
      });
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.success && result.value).not.toBe(null);
      expect(result.success && result.value.items).toHaveLength(3);
      for (var item of (result.success && result.value.items) || []) {
        expect(item).toMatchObject({
          date: expect.any(Date),
          fieldName: expect.any(String),
          fieldType: expect.any(String),
          originIP: expect.any(String),
          originType: expect.any(String),
          subscriberEmail: expect.any(String),
          value: expect.any(String),
        });
      }
    });
  });

  describe('getSubscribersLists', () => {
    it('should get an error when the response is not valid', async () => {
      // Arrange
      const request = jest.fn(async () => {}); // Invalid response
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscribersLists(
        1,
        SubscriberListState.ready.toString(),
      );

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(false);
    });

    it('should call API with the right parameters and parse a successful response', async () => {
      // Arrange
      const page = 1;
      const state = SubscriberListState.ready;
      const httpResponseBody = {
        status: 200,
        data: {
          items: [
            { name: 'List 1', listId: 1, subscribersCount: 1, currentStatus: state },
            { name: 'List 2', listId: 2, subscribersCount: 2, currentStatus: state },
          ],
          currentPage: page,
          itemsCount: 2,
          pagesCount: page,
        },
      };
      const request = jest.fn(async () => httpResponseBody);
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscribersLists(
        1,
        SubscriberListState.ready.toString(),
      );

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith({
        headers: {
          Authorization: `token ${jwtToken}`,
        },
        method: 'GET',
        url: `/accounts/${accountEmail}/lists/?page=${page}&state=${state}`,
      });
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.value).not.toBe(null);
      expect(result.value.items).toHaveLength(httpResponseBody.data.items.length);
      result.value.items.map((item: any) =>
        expect(item).toMatchObject({
          name: expect.any(String),
          id: expect.any(Number),
          amountSubscribers: expect.any(Number),
          state: expect.any(Number),
        }),
      );
    });
  });
});
