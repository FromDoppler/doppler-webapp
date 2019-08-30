import React from 'react';
import { render, cleanup, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import ReportsPageRanking from './ReportsPageRanking';
import { AppServicesProvider } from '../../../services/pure-di';

const fakeDate = new Date();

const domain = 'www.fromdoppler.com';

const fakePagesData = {
  success: true,
  value: [
    {
      name: 'https://www.fromdoppler.com/email-marketing',
      totalVisits: 10122,
      withEmail: 200,
    },
    {
      name: 'https://www.fromdoppler.com/precios',
      totalVisits: 9000,
      withEmail: 200,
    },
    {
      name: 'https://www.fromdoppler.com/login',
      totalVisits: 5001,
      withEmail: 200,
    },
  ],
};

const emptyResponse = {
  success: false,
  value: [],
};

describe('Reports pages ranking', () => {
  afterEach(cleanup);

  it('render component without pages', () => {
    const datahubClientDouble = {
      getPagesRankingByPeriod: async () => emptyResponse,
    };

    render(
      <AppServicesProvider forcedServices={{ datahubClient: datahubClientDouble }}>
        <DopplerIntlProvider>
          <ReportsPageRanking />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
  });

  it('should render pages ranking', async () => {
    const datahubClientDouble = {
      getPagesRankingByPeriod: async () => fakePagesData,
    };

    const { getByText } = render(
      <AppServicesProvider forcedServices={{ datahubClient: datahubClientDouble }}>
        <DopplerIntlProvider>
          <ReportsPageRanking domainName={domain} dateTo={fakeDate} dateFrom={fakeDate} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    await wait(() => getByText('https://www.fromdoppler.com/email-marketing'));

    const pageName = getByText('https://www.fromdoppler.com/email-marketing');

    expect(pageName).toBeDefined();
  });
});
