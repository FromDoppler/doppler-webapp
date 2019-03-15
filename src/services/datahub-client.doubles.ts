import { DatahubClient } from './datahub-client';
import { timeout } from '../utils';

// TODO: use more realistic data
const fakeData = [
  {
    id: 1,
    name: 'www.fromdoppler.com',
    verified_date: new Date('2017-12-17'),
    pages: [
      { id: 1, name: 'productos' },
      { id: 2, name: 'servicios' },
      { id: 3, name: 'funcionalidades' },
      { id: 4, name: 'contacto' },
    ],
  },
  {
    id: 2,
    name: 'www.makingsense.com',
    verified_date: new Date('2010-12-17'),
    pages: [{ id: 1, name: 'productos2' }, { id: 2, name: 'servicios2' }],
  },
  {
    id: 3,
    name: 'www.google.com',
    verified_date: new Date('2017-12-17'),
    pages: [],
  },
];

export class HardcodedDatahubClient implements DatahubClient {
  public async getAccountDomains() {
    await timeout(3000);
    return fakeData.map((x) => ({ id: x.id, name: x.name, verified_date: x.verified_date }));
  }

  public async getPagesByDomainId(domainId: number) {
    await timeout(2000);
    const domain = fakeData.find((x) => x.id === domainId);
    if (!domain) {
      throw new Error(`Domain with id ${domainId} does not exist`);
    }
    return domain.pages;
  }
}
