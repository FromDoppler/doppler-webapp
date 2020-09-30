import { DopplerBillingApiClient, Invoices } from './doppler-billing-api-client';
import { timeout } from '../utils';
import { ResultWithoutExpectedErrors } from '../doppler-types';

export class HardcodedDopplerBillingApiClient implements DopplerBillingApiClient {
  public async getInvoices(
    page: number,
    pageSize: number,
  ): Promise<ResultWithoutExpectedErrors<Invoices>> {
    console.log('getInvoices');
    await timeout(1500);

    return {
      value: {
        items: [
          {
            accountId: 'CD0000000073680',
            product: 'Product 1',
            date: new Date('2020-09-29T00:00:00'),
            currency: 'ARS',
            amount: 550,
            filename: 'invoice_2020-10-05_10.pdf',
          },
          {
            accountId: 'CD0000000073681',
            product: 'Product 2',
            date: new Date('2020-09-30T00:00:00'),
            currency: 'ARS',
            amount: 750.5,
            filename: 'invoice_2020-10-05_10.pdf',
          },
          {
            accountId: 'CD0000000073682',
            product: 'Product 3',
            date: new Date('2020-10-01T00:00:00'),
            currency: 'ARS',
            amount: 1000,
            filename: 'invoice_2020-10-05_10.pdf',
          },
          {
            accountId: 'CD0000000073683',
            product: 'Product 4',
            date: new Date('2020-10-02T00:00:00'),
            currency: 'ARS',
            amount: 1100,
            filename: 'invoice_2020-10-05_10.pdf',
          },
          {
            accountId: 'CD0000000073684',
            product: 'Product 5',
            date: new Date('2020-10-03T00:00:00'),
            currency: 'ARS',
            amount: 1300,
            filename: 'invoice_2020-10-05_10.pdf',
          },
          {
            accountId: 'CD0000000073685',
            product: 'Product 6',
            date: new Date('2020-10-04T00:00:00'),
            currency: 'ARS',
            amount: 1500,
            filename: 'invoice_2020-10-05_10.pdf',
          },
          {
            accountId: 'CD0000000073686',
            product: 'Product 7',
            date: new Date('2020-10-05T00:00:00'),
            currency: 'ARS',
            amount: 450,
            filename: 'invoice_2020-10-05_10.pdf',
          },
          {
            accountId: 'CD0000000073687',
            product: 'Product 8',
            date: new Date('2020-10-06T00:00:00'),
            currency: 'ARS',
            amount: 2500,
            filename: 'invoice_2020-10-05_10.pdf',
          },
          {
            accountId: 'CD0000000073688',
            product: 'Product 9',
            date: new Date('2020-10-07T00:00:00'),
            currency: 'ARS',
            amount: 2000,
            filename: 'invoice_2020-10-05_10.pdf',
          },
          {
            accountId: 'CD0000000073689',
            product: 'Product 10',
            date: new Date('2020-10-08T00:00:00'),
            currency: 'ARS',
            amount: 2300,
            filename: 'invoice_2020-10-05_10.pdf',
          },
        ],
        totalItems: 10,
      },
      success: true,
    };
  }
}
