import { ResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';
import { SubscriberList, SubscriberListState } from './shopify-client';
import { searchLinkByRel } from '../utils';

export interface DopplerApiClient {
  getListData(idList: number, apikey: string): Promise<ResultWithoutExpectedErrors<SubscriberList>>;
  getSubscriber(email: string, apikey: string): Promise<ResultWithoutExpectedErrors<Subscriber>>;
  getSubscriberSentCampaigns(
    email: string,
    campaignsPerPage: number,
    currentPage: number,
  ): Promise<ResultWithoutExpectedErrors<CampaignDeliveryCollection>>;
  getSubscribers(searchText: string): Promise<ResultWithoutExpectedErrors<SubscriberCollection>>;
  getCampaignSummaryResults(
    idCampaign: number,
  ): Promise<ResultWithoutExpectedErrors<CampaignSummaryResults>>;
  getCampaignNameAndSubject(campaignId: number): Promise<ResultWithoutExpectedErrors<CampaignInfo>>;
  getUserFields(): Promise<ResultWithoutExpectedErrors<Fields[]>>;
  getSubscribersLists(
    page: number,
    state: string,
  ): Promise<ResultWithoutExpectedErrors<SubscriberListCollection>>;
}
interface DopplerApiConnectionData {
  jwtToken: string;
  userAccount: string;
}

export interface Fields {
  name: string;
  value: string;
  predefined: boolean;
  private: boolean;
  readonly: boolean;
  type: string;
}

export interface Subscriber {
  email: string;
  fields: Fields[];
  unsubscribedDate: string;
  unsubscriptionType: string;
  manualUnsubscriptionReason: string;
  unsubscriptionComment: string;
  status: string;
  score: number;
  downloadPermissionHistoryUrl: string;
}

export interface FieldUpdateEvent {
  subscriberEmail: string;
  fieldName: string;
  fieldType: string;
  date: Date;
  originIP: string;
  value: string | null;
  originType: string;
  // TODO: add some Form related fields
  // originFormName: string
  // originFormUrl: string
}

export interface FieldHistoryPage {
  items: FieldUpdateEvent[];
  currentPage: number;
  itemsCount: number;
  pagesCount: number;
}

interface CampaignDelivery {
  campaignId: number;
  campaignName: string;
  campaignSubject: string;
  clicksCount: number;
  deliveryStatus: string;
  isSendingNow: boolean;
  urlImgPreview: string;
}

export interface CampaignDeliveryCollection {
  items: CampaignDelivery[];
  currentPage: number;
  itemsCount: number;
  pagesCount: number;
}

export interface SubscriberCollection {
  items: Subscriber[];
  currentPage: number;
  itemsCount: number;
  pagesCount: number;
}

export interface SubscriberListCollection {
  items: SubscriberList[];
  currentPage: number;
  itemsCount: number;
  pagesCount: number;
}

export interface CampaignSummaryResults {
  totalRecipients: number;
  successFullDeliveries: number;
  timesForwarded: number;
  totalTimesOpened: number;
  lastOpenDate: string | null;
  uniqueClicks: number;
  uniqueOpens: number;
  totalUnopened: number;
  totalHardBounces: number;
  totalSoftBounces: number;
  totalClicks: number;
  lastClickDate: string | null;
  totalUnsubscribers: number;
  campaignStatus: string;
  totalShipped: number;
}

export interface CampaignInfo {
  name: string;
  subject: string;
}

export class HttpDopplerApiClient implements DopplerApiClient {
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

  private getDopplerApiConnectionData(): DopplerApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler API connection data is not available');
    }
    return {
      jwtToken: connectionData.jwtToken,
      userAccount: connectionData ? connectionData.userData.user.email : '',
    };
  }

  private mapList(data: any): SubscriberList {
    return {
      name: data.name,
      id: data.listId,
      amountSubscribers: data.subscribersCount,
      state:
        data.currentStatus === SubscriberListState.ready
          ? SubscriberListState.ready
          : SubscriberListState.synchronizingContacts,
      entity: null,
    };
  }

  private mapSubscriberFields(data: any): Fields[] {
    return data.map((x: any) => ({
      name: x.name,
      value: x.value,
      predefined: x.predefined,
      private: x.private,
      readonly: x.readonly,
      type: x.type,
      permissionHTML: x.permissionHTML,
    }));
  }

  private mapFieldUpdateEvent(item: any): FieldUpdateEvent {
    return {
      subscriberEmail: item.subscriberEmail,
      fieldName: item.fieldName,
      fieldType: item.fieldType,
      date: new Date(item.date),
      originIP: item.originIP,
      value: item.value,
      originType: item.originType,
    };
  }

  //TODO: Maybe is possible to use the new funtion 'searchLinkByRel' in utils.js.
  //It functions receive the links and the rel
  private searchLinkByRel(items: any, rel: string) {
    const imgPreview = items.find((x: any) => x.rel.includes(rel));
    return imgPreview ? imgPreview.href : '';
  }

  private mapCampaignsDelivery(data: any): CampaignDelivery[] {
    return data.map((x: any) => ({
      campaignId: x.campaignId,
      campaignName: x.campaignName,
      campaignSubject: x.campaignSubject,
      clicksCount: x.clicksCount,
      deliveryStatus: x.deliveryStatus,
      isSendingNow: x.isSendingNow,
      urlImgPreview: this.searchLinkByRel(x._links, '/docs/rels/get-campaign-preview'),
    }));
  }

  private mapSubscribers(data: any): Subscriber[] {
    return data.map((x: any) => ({
      email: x.email,
      fields: this.mapSubscriberFields(x.fields),
      unsubscribedDate: x.unsubscribedDate,
      unsubscriptionType: x.unsubscriptionType,
      manualUnsubscriptionReason: x.manualUnsubscriptionReason,
      unsubscriptionComment: x.unsubscriptionComment,
      status: this.getSubscriberStatus(
        x.status,
        x.belongsToLists,
        x.unsubscriptionType,
        x.manualUnsubscriptionReason,
      ),
      score: x.score,
      downloadPermissionHistoryUrl: this.getDownloadUrl(x._links),
    }));
  }

  private mapCampaignSummaryResultsFields(data: any): CampaignSummaryResults {
    return {
      totalRecipients: data.totalRecipients,
      successFullDeliveries: data.successFullDeliveries,
      timesForwarded: data.timesForwarded,
      totalTimesOpened: data.totalTimesOpened,
      lastOpenDate: data.lastOpenDate,
      uniqueClicks: data.uniqueClicks,
      uniqueOpens: data.uniqueOpens,
      totalUnopened: data.totalUnopened,
      totalHardBounces: data.totalHardBounces,
      totalSoftBounces: data.totalSoftBounces,
      totalClicks: data.totalClicks,
      lastClickDate: data.lastClickDate,
      totalUnsubscribers: data.totalUnsubscribers,
      campaignStatus: data.campaignStatus,
      totalShipped: data.totalShipped,
    };
  }

  private getUnsubscribedStatus(
    unsubscriptionType: string,
    manualUnsubscriptionReason: string,
  ): string {
    let unsubscribedStatus: string = '';
    switch (unsubscriptionType) {
      case 'hardBounce':
        unsubscribedStatus = 'hard';
        break;
      case 'softBounce':
        unsubscribedStatus = 'soft';
        break;
      case 'neverOpen':
        unsubscribedStatus = 'never_open';
        break;
      case 'manual':
        unsubscribedStatus =
          manualUnsubscriptionReason === 'administrative' ? 'client' : 'subscriber';
        break;
      case 'abuseLink':
      case 'feedbackLoop':
      case 'internalPolicies':
        unsubscribedStatus = 'subscriber';
        break;
      default:
        unsubscribedStatus = '';
        break;
    }
    return unsubscribedStatus;
  }

  private getSubscriberStatus(
    subscriberStatus: string,
    belongsToLists: any,
    unsubscriptionType: string,
    manualUnsubscriptionReason: string,
  ): string {
    let status: string = '';
    switch (subscriberStatus) {
      case 'pending':
        status = 'pending';
        break;
      case 'standBy':
        status = 'standBy';
        break;
      case 'active':
        status = belongsToLists.length ? 'active' : 'inactive';
        break;
      case 'unsubscribed':
        status = `unsubscribed_by_${this.getUnsubscribedStatus(
          unsubscriptionType,
          manualUnsubscriptionReason,
        )}`;
        break;
      default:
        break;
    }
    return status;
  }

  private getDownloadUrl(links: any[]): string {
    if (links) {
      const link = searchLinkByRel(links, 'docs/rels/get-permission-history-csv')[0];
      return !!link ? link.href : '';
    }

    return '';
  }

  public async getListData(listId: number): Promise<ResultWithoutExpectedErrors<SubscriberList>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/lists/${listId}`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapList(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getSubscriber(email: string): Promise<ResultWithoutExpectedErrors<Subscriber>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/subscribers/${email}`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      const subscriber = {
        email: response.data.email,
        fields: this.mapSubscriberFields(response.data.fields),
        unsubscribedDate: response.data.unsubscribedDate,
        unsubscriptionType: response.data.unsubscriptionType,
        manualUnsubscriptionReason: response.data.manualUnsubscriptionReason,
        unsubscriptionComment: response.data.unsubscriptionComment,
        status: this.getSubscriberStatus(
          response.data.status,
          response.data.belongsToLists,
          response.data.unsubscriptionType,
          response.data.manualUnsubscriptionReason,
        ),
        score: response.data.score,
        downloadPermissionHistoryUrl: this.getDownloadUrl(response.data._links),
      };

      return {
        success: true,
        value: subscriber,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  public async getSubscriberSentCampaigns(
    email: string,
    campaignsPerPage: number,
    currentPage: number,
  ): Promise<ResultWithoutExpectedErrors<CampaignDeliveryCollection>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const { data } = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/subscribers/${email}/deliveries`,
        headers: { Authorization: `token ${jwtToken}` },
        params: { per_page: campaignsPerPage, page: currentPage },
      });

      const campaignsDeliveryCollection = {
        items: this.mapCampaignsDelivery(data.items),
        itemsCount: data.itemsCount,
        currentPage: data.currentPage,
        pagesCount: data.pagesCount,
      };

      return {
        success: true,
        value: campaignsDeliveryCollection,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  public async getSubscribers(
    searchText: string,
  ): Promise<ResultWithoutExpectedErrors<SubscriberCollection>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const { data } = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/subscribers/`,
        headers: { Authorization: `token ${jwtToken}` },
        params: { keyword: searchText },
      });

      const subscriberCollection = {
        items: this.mapSubscribers(data.items),
        itemsCount: data.itemsCount,
        currentPage: data.currentPage,
        pagesCount: data.pagesCount,
      };

      return {
        success: true,
        value: subscriberCollection,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  public async getCampaignSummaryResults(
    campaignId: number,
  ): Promise<ResultWithoutExpectedErrors<CampaignSummaryResults>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const { data } = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/campaigns/${campaignId}/results-summary`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      return {
        success: true,
        value: this.mapCampaignSummaryResultsFields(data),
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  public async getCampaignNameAndSubject(
    campaignId: number,
  ): Promise<ResultWithoutExpectedErrors<CampaignInfo>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const { data } = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/campaigns/${campaignId}`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      return {
        success: true,
        value: { name: data.name, subject: data.subject },
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  public async getUserFields(): Promise<ResultWithoutExpectedErrors<Fields[]>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const { data } = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/fields/`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      return {
        success: true,
        value: this.mapSubscriberFields(data.items),
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  // TODO: consider special characters in fieldName
  // TODO: test it with the real backend
  // TODO: add pagination (maybe it is not necessary for this stage, with the ten first items we are fine)
  public async getSubscriberPermissionHistory({
    subscriberEmail,
    fieldName,
  }: {
    subscriberEmail: string;
    fieldName: string;
  }): Promise<ResultWithoutExpectedErrors<FieldHistoryPage>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const { data } = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/subscribers/${subscriberEmail}/permissions-history/${fieldName}`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      return {
        success: true,
        value: {
          items: data.items.map(this.mapFieldUpdateEvent),
          itemsCount: data.itemsCount,
          currentPage: data.currentPage,
          pagesCount: data.pagesCount,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  async getSubscribersLists(
    page: number,
    state: string,
  ): Promise<ResultWithoutExpectedErrors<SubscriberListCollection>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/lists/?page=${page}&state=${state}`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return {
          success: true,
          value: {
            items: response.data.items.map(this.mapList),
            itemsCount: response.data.itemsCount,
            currentPage: response.data.currentPage,
            pagesCount: response.data.pagesCount,
          },
        };
      } else {
        return { success: false, error: response };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }
}
