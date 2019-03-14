import { timeout } from '../../utils';

const fakeData = [
  {
    id: 1,
    name: 'www.fromdoppler.com',
    verified_date: '17/12/2017',
    pages: [
      { id: '1', name: 'productos' },
      { id: '2', name: 'servicios' },
      { id: '3', name: 'funcionalidades' },
      { id: '4', name: 'contacto' },
    ],
  },
  {
    id: 2,
    name: 'www.makingsense.com',
    verified_date: '17/12/2020',
    pages: [{ id: '1', name: 'productos2' }, { id: '2', name: 'servicios2' }],
  },
  {
    id: 3,
    name: 'www.google.com',
    verified_date: '17/12/2019',
    pages: [],
  },
];

export async function getDomains() {
  //TODO implement get domains
  await timeout(3000);
  return fakeData.map((domain) => ({
    id: domain.id,
    name: domain.name,
    verified_date: domain.verified_date,
  }));
}

export async function getPagesByDomainId(domainId) {
  //TODO implement get pages by domain id
  await timeout(2000);
  return fakeData.find((domain) => domain.id === domainId).pages;
}
