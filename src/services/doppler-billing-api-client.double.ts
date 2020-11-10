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
      documentType: x.documentType,
      documentNumber: x.documentNumber,
      creationDate: !!x.creationDate ? new Date(x.creationDate) : null,
      dueDate: !!x.dueDate ? new Date(x.dueDate) : null,
      currency: x.currency,
      amount: x.amount,
      paidToDate: x.paidToDate,
      balance: x.balance,
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
          documentType: 'FC',
          documentNumber: 'A-0001-00000001',
          creationDate: '2020-10-08T00:00:00',
          dueDate: '2020-10-15T00:00:00',
          currency: 'ARS',
          amount: 550,
          paidToDate: 300,
          balance: 250,
          filename: 'invoice_2020-10-08_10.pdf',
          _links: [],
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000002',
          creationDate: '2020-10-07T00:00:00',
          dueDate: '2020-10-17T00:00:00',
          currency: 'ARS',
          amount: 750.5,
          paidToDate: 750.5,
          balance: 0,
          filename: 'invoice_2020-10-07_10.pdf',
          _links: [],
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000003',
          creationDate: '2020-10-06T00:00:00',
          dueDate: '2020-10-14T00:00:00',
          currency: 'ARS',
          amount: 1000,
          paidToDate: 1000,
          balance: 0,
          filename: 'invoice_2020-10-06_10.pdf',
          _links: [],
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000004',
          creationDate: '2020-10-05T00:00:00',
          dueDate: '2020-10-10T00:00:00',
          currency: 'ARS',
          amount: 1100,
          paidToDate: 1100,
          balance: 0,
          filename: 'invoice_2020-10-05_10.pdf',
          _links: [],
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000005',
          creationDate: '2020-10-04T00:00:00',
          dueDate: '2020-10-13T00:00:00',
          currency: 'ARS',
          amount: 1300,
          paidToDate: 500,
          balance: 800,
          filename: 'invoice_2020-10-04_10.pdf',
          _links: [],
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000006',
          creationDate: '2020-10-03T00:00:00',
          dueDate: '2020-10-10T00:00:00',
          currency: 'ARS',
          amount: 1500,
          paidToDate: 1500,
          balance: 0,
          filename: 'invoice_2020-10-03_10.pdf',
          _links: [],
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000007',
          creationDate: '2020-10-02T00:00:00',
          dueDate: '2020-10-09T00:00:00',
          currency: 'ARS',
          amount: 450,
          paidToDate: 450,
          balance: 0,
          filename: 'invoice_2020-10-02_10.pdf',
          _links: [],
        },
        {
          documentType: 'NC',
          documentNumber: 'A-0001-00000008',
          creationDate: '2020-10-01T00:00:00',
          dueDate: '2020-10-08T00:00:00',
          currency: 'ARS',
          amount: -2500,
          paidToDate: -2500,
          balance: 0,
          filename: 'invoice_2020-10-01_10.pdf',
          _links: [],
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000009',
          creationDate: '2020-09-30T00:00:00',
          dueDate: '2020-10-04T00:00:00',
          currency: 'ARS',
          amount: 2000,
          paidToDate: 2000,
          balance: 0,
          filename: 'invoice_2020-09-30_10.pdf',
          _links: [],
        },
        {
          documentType: 'FC',
          documentNumber: 'A-0001-00000010',
          creationDate: '2020-09-29T00:00:00',
          dueDate: '2020-10-04T00:00:00',
          currency: 'ARS',
          amount: 2300,
          paidToDate: 2300,
          balance: 0,
          filename: 'invoice_2020-09-29_10.pdf',
          _links: [],
        },
        {
          documentType: 'NC',
          documentNumber: 'A-0001-00000011',
          creationDate: '2020-09-28T00:00:00',
          dueDate: '2020-10-03T00:00:00',
          currency: 'ARS',
          amount: -2300,
          paidToDate: -2300,
          balance: 0,
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
