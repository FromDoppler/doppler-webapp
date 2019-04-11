import React from 'react';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import Reports from './Reports';
import { AppServicesProvider } from '../../services/pure-di';

const verifiedDateAsEngString = '12/17/2017';
const verifiedDateAsDate = new Date('2017-12-17');

const fakeData = [
  {
    id: 1,
    name: 'www.fromdoppler.com',
    verified_date: verifiedDateAsDate,
  },
  {
    id: 2,
    name: 'www.makingsense.com',
    verified_date: verifiedDateAsDate,
  },
];

const fakePages = [{ id: 1, name: 'productos2' }, { id: 2, name: 'servicios2' }];

describe('Reports page', () => {
  afterEach(cleanup);

  it('render page without domain', () => {
    const datahubClientDouble = {
      getAccountDomains: async () => [],
    };

    render(
      <AppServicesProvider forcedServices={{ datahubClient: datahubClientDouble }}>
        <DopplerIntlProvider>
          <Reports dependencies={{ datahubClient: datahubClientDouble }} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
  });

  it('should render domains without pages', async () => {
    const datahubClientDouble = {
      getAccountDomains: async () => fakeData,
      getVisitsByPeriod: async () => 0,
      getPagesRankingByPeriod: async () => [],
    };

    const { getByText } = render(
      <AppServicesProvider forcedServices={{ datahubClient: datahubClientDouble }}>
        <DopplerIntlProvider>
          <Reports />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    await wait(() => getByText(verifiedDateAsEngString));

    const verifiedDate = getByText(verifiedDateAsEngString);
    const domain = getByText(fakeData[1].name);

    expect(verifiedDate).toBeDefined();
    expect(domain).toBeDefined();
  });
});
