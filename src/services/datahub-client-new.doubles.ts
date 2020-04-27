import { DatahubClientNew, DomainsResult } from './datahub-client-new';
import { timeout } from '../utils';

const domains = [
  {
    name: 'www.fromdoppler.com',
    verified_date: new Date('2010-12-17'),
    pages: [],
  },
  {
    name: 'www.makingsense.com',
    verified_date: null,
    pages: [],
  },
  {
    name: 'www.google.com',
    verified_date: new Date('2017-12-17'),
    pages: [],
  },
];

export class HardcodedDatahubClientNew implements DatahubClientNew {
  public async getAccountDomains(): Promise<DomainsResult> {
    console.log('getAccountDomains');
    await timeout(1500);
    const data = domains.map((x) => ({ name: x.name, verified_date: x.verified_date }));
    return {
      success: true,
      value: data,
    };

    //return {
    //  success: false,
    //  error: new Error('Dummy error'),
    //};
  }
}
