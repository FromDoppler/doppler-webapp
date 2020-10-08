import { DopplerBillingApiClient, Invoices, Invoice } from './doppler-billing-api-client';
import { timeout } from '../utils';
import { ResultWithoutExpectedErrors } from '../doppler-types';
import { searchLinkByRel } from '../utils';

export class HardcodedDopplerBillingApiClient implements DopplerBillingApiClient {
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
    console.log('getInvoices');
    await timeout(1500);

    var dataFromBilling = {
      items: [
        {
          accountId: 'CD0000000073680',
          product: 'Producto 1',
          date: '2020-10-08T00:00:00',
          currency: 'ARS',
          amount: 550,
          filename: 'invoice_2020-10-08_10.pdf',
          _links: [],
        },
        {
          accountId: 'CD0000000073681',
          product: 'Producto 2',
          date: '2020-10-07T00:00:00',
          currency: 'ARS',
          amount: 750.5,
          filename: 'invoice_2020-10-07_10.pdf',
          _links: [],
        },
        {
          accountId: 'CD0000000073682',
          product: 'Producto 3',
          date: '2020-10-06T00:00:00',
          currency: 'ARS',
          amount: 1000,
          filename: 'invoice_2020-10-06_10.pdf',
          _links: [],
        },
        {
          accountId: 'CD0000000073683',
          product: 'Producto 4',
          date: '2020-10-05T00:00:00',
          currency: 'ARS',
          amount: 1100,
          filename: 'invoice_2020-10-05_10.pdf',
          _links: [],
        },
        {
          accountId: 'CD0000000073684',
          product: 'Producto 5',
          date: '2020-10-04T00:00:00',
          currency: 'ARS',
          amount: 1300,
          filename: 'invoice_2020-10-04_10.pdf',
          _links: [],
        },
        {
          accountId: 'CD0000000073685',
          product: 'Producto 6',
          date: '2020-10-03T00:00:00',
          currency: 'ARS',
          amount: 1500,
          filename: 'invoice_2020-10-03_10.pdf',
          _links: [],
        },
        {
          accountId: 'CD0000000073686',
          product: 'Producto 7',
          date: '2020-10-02T00:00:00',
          currency: 'ARS',
          amount: 450,
          filename: 'invoice_2020-10-02_10.pdf',
          _links: [],
        },
        {
          accountId: 'CD0000000073687',
          product: 'Producto 8',
          date: '2020-10-01T00:00:00',
          currency: 'ARS',
          amount: 2500,
          filename: 'invoice_2020-10-01_10.pdf',
          _links: [],
        },
        {
          accountId: 'CD0000000073688',
          product: 'Producto 9',
          date: '2020-09-30T00:00:00',
          currency: 'ARS',
          amount: 2000,
          filename: 'invoice_2020-09-30_10.pdf',
          _links: [],
        },
        {
          accountId: 'CD0000000073689',
          product: 'Producto 10',
          date: '2020-09-29T00:00:00',
          currency: 'ARS',
          amount: 2300,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [],
        },
        {
          accountId: 'CD0000000073689',
          product: 'Producto 11',
          date: '2020-09-28T00:00:00',
          currency: 'ARS',
          amount: 2300,
          filename: 'invoice_2020-09-28_10.pdf',
          _links: [],
        },
      ],
      totalItems: 11,
    };

    let invoicesPaged = [];

    //The paging is manually because it dummy service.
    //For the real service, the paging is in the api
    if (pageSize > 0 && page > 0) {
      const indexStart = pageSize * (page - 1);
      const indexEnd = indexStart + pageSize;
      invoicesPaged = dataFromBilling.items.slice(indexStart, indexEnd);
    } else {
      invoicesPaged = dataFromBilling.items;
    }

    return {
      value: {
        items: this.mapInvoices(invoicesPaged),
        totalItems: dataFromBilling.totalItems,
      },
      success: true,
    };
  }
}
