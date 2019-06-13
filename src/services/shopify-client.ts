import { Result } from '../doppler-types';
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
