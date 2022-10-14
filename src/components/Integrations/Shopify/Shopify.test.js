import React from 'react';
import {
  render,
  cleanup,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import Shopify, { FETCH_SHOPIFY_DATA_INTERVAL } from './Shopify';
import { SubscriberListState } from '../../../services/shopify-client';

const oneShop = [
  {
    shopName: 'myshop.com',
    synchronization_date: new Date('2017-12-17'),
    list: {
      name: 'MyList',
      id: 1251,
      amountSubscribers: 2,
      state: SubscriberListState.ready,
    },
  },
];
const twoShops = [
  {
    shopName: 'myshop.com',
    synchronization_date: new Date('2017-12-17'),
    list: {
      name: 'MyList',
      id: 1251,
      amountSubscribers: 2,
      state: SubscriberListState.ready,
    },
  },
  {
    shopName: 'myshop2.com',
    synchronization_date: new Date('2017-12-17'),
    list: {
      name: 'MyList',
      id: 1251,
      amountSubscribers: 2,
      state: SubscriberListState.ready,
    },
  },
];

const emptyResponse = { success: true, value: [] };
const oneShopConnected = { success: true, value: oneShop };
const moreThanOneShopConnected = { success: true, value: twoShops };
const unexpectedErrorResponse = { success: false, message: 'Some random error' };

describe('Shopify Component', () => {
  afterEach(cleanup);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should show not connected user data', async () => {
    const shopifyClientDouble = {
      getShopifyData: async () => emptyResponse,
    };
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          shopifyClient: shopifyClientDouble,
        }}
      >
        <DopplerIntlProvider>
          <Shopify />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitFor(() => expect(getByText('shopify.header_disconnected_warning')));
  });

  it('should get connected user with one shop', async () => {
    const shopifyClientDouble = {
      getShopifyData: async () => oneShopConnected,
    };
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          shopifyClient: shopifyClientDouble,
        }}
      >
        <DopplerIntlProvider>
          <Shopify />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitFor(() => expect(getByText(oneShopConnected.value[0].shopName)));
  });

  it('should get connected user with one shop and one list in sync state', async () => {
    // Arrange
    const oneShopSyncList = [
      {
        shopName: 'myshop.com',
        synchronization_date: new Date('2017-12-17'),
        list: {
          name: 'MyList',
          id: 1251,
          amountSubscribers: 2,
          state: SubscriberListState.synchronizingContacts,
        },
      },
    ];
    const syncList = { success: true, value: oneShopSyncList };
    const shopifyClientDouble = {
      getShopifyData: async () => syncList,
    };

    // Act
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          shopifyClient: shopifyClientDouble,
        }}
      >
        <DopplerIntlProvider>
          <Shopify />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitFor(() => expect(getByText('common.synchronizing')));
  });

  it('should get connected user with more than one shop', async () => {
    const shopifyClientDouble = {
      getShopifyData: async () => moreThanOneShopConnected,
    };
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          shopifyClient: shopifyClientDouble,
        }}
      >
        <DopplerIntlProvider>
          <Shopify />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitFor(() => {
      expect(getByText(moreThanOneShopConnected.value[0].shopName));
      expect(getByText(moreThanOneShopConnected.value[1].shopName));
    });
  });

  it('should manage unexpected errors', async () => {
    const shopifyClientDouble = {
      getShopifyData: async () => unexpectedErrorResponse,
    };
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          shopifyClient: shopifyClientDouble,
        }}
      >
        <DopplerIntlProvider>
          <Shopify />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitFor(() => expect(getByText('validation_messages.error_unexpected_MD')));
  });

  it('should use DopplerAPI client when there is a list associated', async () => {
    // Arrange
    const listExist = {
      success: true,
      value: {
        name: 'Shopify Contacto',
        id: 27311899,
        amountSubscribers: 200,
        state: SubscriberListState.ready,
      },
    };

    const shopifyClientDouble = {
      getShopifyData: async () => oneShopConnected,
    };
    const dopplerAPIClientDouble = {
      getListData: async () => listExist,
    };

    // Act
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          shopifyClient: shopifyClientDouble,
          dopplerApiClient: dopplerAPIClientDouble,
        }}
      >
        <DopplerIntlProvider>
          <Shopify />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitFor(() => {
      expect(container.querySelector('.dp-integration__status')).toBeInTheDocument();
      expect(getByText(listExist.value.amountSubscribers.toString()));
    });
  });

  it(`should execute get shopify data every ${
    FETCH_SHOPIFY_DATA_INTERVAL / 1000
  } seconds`, async () => {
    const getShopifyDataMock = jest.fn().mockResolvedValue(oneShopConnected);
    const getListDataMock = jest.fn().mockResolvedValue({
      success: false,
    });

    const shopifyClientDouble = {
      getShopifyData: getShopifyDataMock,
    };
    const dopplerApiClientDouble = {
      getListData: getListDataMock,
    };
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          shopifyClient: shopifyClientDouble,
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <DopplerIntlProvider>
          <Shopify />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    // because it's executed to start
    expect(getShopifyDataMock).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(FETCH_SHOPIFY_DATA_INTERVAL);
    expect(getShopifyDataMock).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(FETCH_SHOPIFY_DATA_INTERVAL);
    expect(getShopifyDataMock).toHaveBeenCalledTimes(3);
  });
});
