import { Result } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession, ShopifyConnectionData } from './app-session';
import { RefObject } from 'react';
export enum SubscriberListState {
  ready,
  synchronizingContacts,
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

export type ShopifyErrorResult = { cannotConnectToAPI: true };
export interface ShopifyClient {
  getShopifyData(): Promise<Result<ConnectedShop[], ShopifyErrorResult>>;
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
        name: 'MyList',
        amountSubscribers: response.importedCustomersCount,
        state:
          response.syncProcessInProgress === true
            ? SubscriberListState.synchronizingContacts
            : SubscriberListState.ready,
      },
    };
  }

  public async getShopifyData(): Promise<Result<ConnectedShop[], ShopifyErrorResult>> {
    let jwtToken;
    try {
      jwtToken = this.getShopifyConnectionData();
    } catch (error) {
      return { success: false, expectedError: error };
    }
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: `/me/shops`,
        headers: { Authorization: `token ${jwtToken}` },
      });
      if (response.data.shopName) {
        const connectedShop = this.mapShop(response.data);
        return { success: true, value: [connectedShop] };
      }
    } catch (error) {
      return { success: false, error: { cannotConnectToAPI: true } };
    }
    return { success: false };
  }
}
