import { AxiosStatic } from 'axios';
import { HttpShopifyClient, SubscriberListState } from './shopify-client';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';

const consoleError = console.error;

function createHttpShopifyClient(axios: any) {
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
  const shopifyClient = new HttpShopifyClient({
    axiosStatic,
    baseUrl: 'http://shopify.test',
    connectionDataRef,
  });
  return shopifyClient;
}

describe('HttpShopifyClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should set connected shop without list correctly', async () => {
    // Arrange
    const connectedWithoutListResponse = {
      headers: {},
      data: [
        {
          connectedOn: '2019-08-09T19:45:43.821Z',
          importedCustomersCount: '0',
          shopName: 'dopplerdevshop.myshopify.com',
          shopifyAccessToken: '861f44ee45f6a3affcf50477d9774d20',
        },
      ],
    };
    const request = jest.fn(async () => connectedWithoutListResponse);
    const shopifyClient = createHttpShopifyClient({ request });

    // Act
    const result = await shopifyClient.getShopifyData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value[0].shopName).toEqual(connectedWithoutListResponse.data[0].shopName);
    expect(result.value[0].list.state).toEqual(SubscriberListState.notAvailable);
  });

  it('should set connected shop with list connected correctly', async () => {
    // Arrange
    const connectedWithListReadyResponse = {
      headers: {},
      data: [
        {
          connectedOn: '2019-08-09T15:13:52.262Z',
          dopplerListId: '27311899',
          dopplerListName: 'Shopify Contacto',
          importedCustomersCount: '6',
          shopName: 'dopplerdevshop.myshopify.com',
          shopifyAccessToken: '2741255a41f37341d0fa6d64d58e5c86',
          syncProcessDopplerImportSubscribersTaskId: 'import-100544891',
          syncProcessInProgress: 'false',
          syncProcessLastRunDate: '2019-08-09T15:24:56.183Z',
        },
      ],
    };
    const request = jest.fn(async () => connectedWithListReadyResponse);
    const shopifyClient = createHttpShopifyClient({ request });

    // Act
    const result = await shopifyClient.getShopifyData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value[0].shopName).toEqual(connectedWithListReadyResponse.data[0].shopName);
    expect(result.value[0].list.name).not.toBe(undefined);
    expect(result.value[0].list.amountSubscribers).not.toBe(undefined);
    expect(result.value[0].list.state).toEqual(SubscriberListState.ready);
  });

  it('should set connected shop with list connected correctly even if sync flag is bool', async () => {
    // Arrange
    const connectedWithListReadyResponseBool = {
      headers: {},
      data: [
        {
          connectedOn: '2019-08-09T15:13:52.262Z',
          dopplerListId: '27311899',
          dopplerListName: 'Shopify Contacto',
          importedCustomersCount: '6',
          shopName: 'dopplerdevshop.myshopify.com',
          shopifyAccessToken: '2741255a41f37341d0fa6d64d58e5c86',
          syncProcessDopplerImportSubscribersTaskId: 'import-100544891',
          syncProcessInProgress: false,
          syncProcessLastRunDate: '2019-08-09T15:24:56.183Z',
        },
      ],
    };
    const request = jest.fn(async () => connectedWithListReadyResponseBool);
    const shopifyClient = createHttpShopifyClient({ request });

    // Act
    const result = await shopifyClient.getShopifyData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value[0].shopName).toEqual(connectedWithListReadyResponseBool.data[0].shopName);
    expect(result.value[0].list.name).not.toBe(undefined);
    expect(result.value[0].list.amountSubscribers).not.toBe(undefined);
    expect(result.value[0].list.state).toEqual(SubscriberListState.ready);
  });

  it('should set connected shop with list connected but synchronizing contacts', async () => {
    // Arrange
    const connectedWithListSyncResponse = {
      headers: {},
      data: [
        {
          connectedOn: '2019-08-09T15:13:52.262Z',
          dopplerListId: '27311899',
          dopplerListName: 'Shopify Contacto',
          importedCustomersCount: '6',
          shopName: 'dopplerdevshop.myshopify.com',
          shopifyAccessToken: '2741255a41f37341d0fa6d64d58e5c86',
          syncProcessDopplerImportSubscribersTaskId: 'import-100544891',
          syncProcessInProgress: 'true',
          syncProcessLastRunDate: '2019-08-09T15:24:56.183Z',
        },
      ],
    };
    const request = jest.fn(async () => connectedWithListSyncResponse);
    const shopifyClient = createHttpShopifyClient({ request });

    // Act
    const result = await shopifyClient.getShopifyData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value[0].shopName).toEqual(connectedWithListSyncResponse.data[0].shopName);
    expect(result.value[0].list.name).not.toBe(undefined);
    expect(result.value[0].list.amountSubscribers).not.toBe(undefined);
    expect(result.value[0].list.state).toEqual(SubscriberListState.synchronizingContacts);
  });

  it('should set connected shop with list connected but synchronizing contacts even if sync flag is bool', async () => {
    // Arrange
    const connectedWithListSyncResponseBool = {
      headers: {},
      data: [
        {
          connectedOn: '2019-08-09T15:13:52.262Z',
          dopplerListId: '27311899',
          dopplerListName: 'Shopify Contacto',
          importedCustomersCount: '6',
          shopName: 'dopplerdevshop.myshopify.com',
          shopifyAccessToken: '2741255a41f37341d0fa6d64d58e5c86',
          syncProcessDopplerImportSubscribersTaskId: 'import-100544891',
          syncProcessInProgress: true,
          syncProcessLastRunDate: '2019-08-09T15:24:56.183Z',
        },
      ],
    };
    const request = jest.fn(async () => connectedWithListSyncResponseBool);
    const shopifyClient = createHttpShopifyClient({ request });

    // Act
    const result = await shopifyClient.getShopifyData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value[0].shopName).toEqual(connectedWithListSyncResponseBool.data[0].shopName);
    expect(result.value[0].list.name).not.toBe(undefined);
    expect(result.value[0].list.amountSubscribers).not.toBe(undefined);
    expect(result.value[0].list.state).toEqual(SubscriberListState.synchronizingContacts);
  });

  it('should set not connected shop', async () => {
    // Arrange
    const notConnected = {
      headers: {},
      data: [],
    };
    const request = jest.fn(async () => notConnected);
    const shopifyClient = createHttpShopifyClient({ request });

    // Act
    const result = await shopifyClient.getShopifyData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value).toEqual([]);
  });

  it('should set error connecting shopify', async () => {
    // Arrange
    const request = jest.fn(async () => {});
    request.mockImplementation(() => {
      throw new Error();
    });
    const shopifyClient = createHttpShopifyClient({ request });

    console.error = jest.fn(); // silence console error for this test run only

    // Act
    const result = await shopifyClient.getShopifyData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
    expect(result.error).not.toBe(undefined);
  });

  it('should not change data by new request when etag is the same', async () => {
    // Arrange
    const connectedWithoutListResponse = {
      headers: {
        etag: 'FirstEtag',
      },
      data: [
        {
          connectedOn: '2019-08-09T19:45:43.821Z',
          importedCustomersCount: '0',
          shopName: 'dopplerdevshop.myshopify.com',
          shopifyAccessToken: '861f44ee45f6a3affcf50477d9774d20',
        },
      ],
    };
    const request = jest.fn();

    const shopifyClient = createHttpShopifyClient({ request });

    // Act
    request.mockResolvedValue(connectedWithoutListResponse);
    const result1 = await shopifyClient.getShopifyData();
    request.mockResolvedValue({ ...connectedWithoutListResponse, headers: { etag: 'FirstEtag' } });
    const result2 = await shopifyClient.getShopifyData();
    // Assert
    expect(result2).toBe(result1);
  });

  it('should change data by new request when etag is different', async () => {
    // Arrange
    const connectedWithoutListResponse = {
      headers: {
        etag: 'FirstEtag',
      },
      data: [
        {
          connectedOn: '2019-08-09T19:45:43.821Z',
          importedCustomersCount: '0',
          shopName: 'dopplerdevshop.myshopify.com',
          shopifyAccessToken: '861f44ee45f6a3affcf50477d9774d20',
        },
      ],
    };
    const request = jest.fn();

    const shopifyClient = createHttpShopifyClient({ request });

    // Act
    request.mockResolvedValue(connectedWithoutListResponse);
    const result1 = await shopifyClient.getShopifyData();
    request.mockResolvedValue({ ...connectedWithoutListResponse, headers: { etag: 'SecondEtag' } });
    const result2 = await shopifyClient.getShopifyData();
    // Assert
    expect(result2).not.toBe(result1);
  });
});
