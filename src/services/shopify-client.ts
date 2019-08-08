import { ResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession, ShopifyConnectionData } from './app-session';
import { RefObject } from 'react';
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
}

export interface ConnectedShop {
  shopName: string;
  synchronization_date: Date | null;
  list: SubscriberList;
}

export interface ShopifyClient {
  getShopifyData(): Promise<ResultWithoutExpectedErrors<ConnectedShop[]>>;
}

export class HttpShopifyClient implements ShopifyClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;
  private readonly connectionDataRef: RefObject<AppSession>;

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
      list: {
        id: response.dopplerListId,
        name: response.dopplerListName,
        amountSubscribers: response.importedCustomersCount,
        state:
          !!response.syncProcessInProgress && response.syncProcessInProgress !== 'false'
            ? SubscriberListState.synchronizingContacts
            : !!response.dopplerListId
            ? SubscriberListState.ready
            : SubscriberListState.notAvailable,
      },
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
      if (response.data.length) {
        const connectedShops = response.data.map((shop: any) => {
          return this.mapShop(shop);
        });
        return { success: true, value: connectedShops };
      } else {
        return { success: true, value: [] };
      }
    } catch (error) {
      console.error(error);
      return { success: false, error: error };
    }
  }
}
