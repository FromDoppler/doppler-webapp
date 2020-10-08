import { ResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';
import { searchLinkByRel } from '../utils';

export interface DopplerBillingApiClient {
  getInvoices(page: number, pageSize: number): Promise<ResultWithoutExpectedErrors<Invoices>>;
}

interface DopplerBillingApiConnectionData {
  jwtToken: string;
  idUser: number;
}

export interface Invoices {
  items: Invoice[];
  totalItems: number;
}

export interface Invoice {
  accountId: string;
  product: string;
  date: Date;
  currency: string;
  amount: number;
  filename: string;
  downloadInvoiceUrl: string;
}

export class HttpDopplerBillingApiClient implements DopplerBillingApiClient {
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

  private getDopplerBillingApiConnectionData(): DopplerBillingApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler Billing API connection data is not available');
    }
    return {
      jwtToken: connectionData.jwtToken,
      idUser: connectionData.userData.user.idUser,
    };
  }

  private getDownloadUrl(links: any[]): string {
    if (links) {
      var link = searchLinkByRel(links, 'file')[0];
      return !!link ? link.href : '';
    }

    return '';
  }

  private mapInvoices(data: any): Invoice[] {
    return data.map((x: any) => ({
      accountId: x.accountId,
      product: x.product,
      date: new Date(x.date),
      currency: x.currency,
      amount: x.amount,
      filename: x.filename,
      downloadInvoiceUrl: this.getDownloadUrl(x._links),
    }));
  }

  public async getInvoices(
    page: number,
    pageSize: number,
  ): Promise<ResultWithoutExpectedErrors<Invoices>> {
    try {
      const { idUser, jwtToken } = this.getDopplerBillingApiConnectionData();
      const account = 'doppler';
      const sortColumn = 'date';
      const sortAsc = false;

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${account}/${idUser}/invoices?page=${page}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortAsc=${sortAsc}`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return {
          success: true,
          value: {
            items: this.mapInvoices(response.data.items),
            totalItems: response.data.totalItems,
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
