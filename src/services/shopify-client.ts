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

export interface ConnectedShops {
  shopName: string;
  synchronization_date: Date | null;
  list: SubscriberList;
}

export interface ShopifyClient {
  getShopifyData(): Promise<ConnectedShops[]>;
}
