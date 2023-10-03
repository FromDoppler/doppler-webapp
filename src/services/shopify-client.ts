import { ResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession, ShopifyConnectionData } from './app-session';
import { RefObject } from 'react';
import { ResponseCache } from './../utils';
export enum SubscriberListState {
  ready,
  synchronizingContacts,
  notAvailable,
}

export interface SubscriberList {
  name: string;
  id: number;
  amountSubscribers: number;
  state: SubscriberListState;
  entity?: string | null;
}

export interface ConnectedShop {
  shopName: string;
  synchronization_date: Date | null;
  lists?: SubscriberList[];
  list?: SubscriberList | null;
}

export interface ShopifyClient {
  getShopifyData(): Promise<ResultWithoutExpectedErrors<ConnectedShop[]>>;
}

export class HttpShopifyClient implements ShopifyClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;
  private readonly connectionDataRef: RefObject<AppSession>;
  private readonly responseCache = new ResponseCache();

  constructor({
    axiosStatic,
    baseUrl,
    connectionDataRef,
  }: {
    axiosStatic: AxiosStatic;
    baseUrl: string;
    connectionDataRef: RefObject<AppSession>;
  }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: this.baseUrl,
    });
    this.connectionDataRef = connectionDataRef;
  }

  private getShopifyConnectionData(): ShopifyConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (!connectionData || connectionData.status !== 'authenticated' || !connectionData.jwtToken) {
      throw new Error('Shopify connection data is not available');
    }
    return connectionData;
  }

  private mapShop(response: any): ConnectedShop {
    return {
      shopName: response.shopName,
      synchronization_date: response.connectedOn,
      lists: response.lists.map((list: any) => ({
        id: list.dopplerListId,
        name: list.dopplerListName,
        amountSubscribers: list.importedCustomersCount,
        state:
          !!response.syncProcessInProgress && response.syncProcessInProgress !== 'false'
            ? SubscriberListState.synchronizingContacts
            : !!list.dopplerListId
            ? SubscriberListState.ready
            : SubscriberListState.notAvailable,
        entity: list.type,
      })),
      list: response.dopplerListId
        ? {
            id: response.dopplerListId,
            name: response.dopplerListName,
            amountSubscribers: response.importedCustomersCount,
            state:
              !!response.syncProcessInProgress && response.syncProcessInProgress !== 'false'
                ? SubscriberListState.synchronizingContacts
                : !!response.dopplerListId
                ? SubscriberListState.ready
                : SubscriberListState.notAvailable,
            entity: null,
          }
        : null,
    };
  }

  public async getShopifyData(): Promise<ResultWithoutExpectedErrors<ConnectedShop[]>> {
    try {
      const { jwtToken } = this.getShopifyConnectionData();
      const response = await this.axios.request({
        method: 'GET',
        url: `/me/shops`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      return this.responseCache.getCachedOrMap(this.getShopifyData, response, (r) => {
        return r.data && r.data.length
          ? { success: true, value: r.data.map(this.mapShop) }
          : { success: true, value: [] };
      });
    } catch (error) {
      console.error(error);
      return { success: false, error: error };
    }
  }
}
