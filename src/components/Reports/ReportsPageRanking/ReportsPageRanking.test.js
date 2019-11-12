import React from 'react';
import { render, cleanup, wait, waitForDomChange } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import ReportsPageRanking from './ReportsPageRanking';
import { AppServicesProvider } from '../../../services/pure-di';

const fakeDate = new Date();

const domain = 'www.fromdoppler.com';

const fakePagesData = {
  success: true,
  value: {
    hasMorePages: false,
    pages: [
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
  },
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

  it('should show error message without pages', async () => {
    const datahubClientDouble = {
      getPagesRankingByPeriod: async () => {
        return { success: false, error: '' };
      },
    };

    const { getByText, container } = render(
      <AppServicesProvider forcedServices={{ datahubClient: datahubClientDouble }}>
        <DopplerIntlProvider>
          <ReportsPageRanking domainName={domain} dateTo={fakeDate} dateFrom={fakeDate} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitForDomChange();
    expect(getByText('trafficSources.error'));
  });

  it('should show empty message when dont have pages', async () => {
    const datahubClientDouble = {
      getPagesRankingByPeriod: async () => {
        return { success: true, value: { hasMorePages: false, pages: [] } };
      },
    };

    const { getByText, container } = render(
      <AppServicesProvider forcedServices={{ datahubClient: datahubClientDouble }}>
        <DopplerIntlProvider>
          <ReportsPageRanking domainName={domain} dateTo={fakeDate} dateFrom={fakeDate} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitForDomChange();
    expect(getByText('common.empty_data'));
  });

  it('should show more results button', async () => {
    const datahubClientDouble = {
      getPagesRankingByPeriod: async () => {
        return {
          success: true,
          value: {
            hasMorePages: true,
            pages: [
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
            ],
          },
        };
      },
    };

    const { getByText, container } = render(
      <AppServicesProvider forcedServices={{ datahubClient: datahubClientDouble }}>
        <DopplerIntlProvider>
          <ReportsPageRanking domainName={domain} dateTo={fakeDate} dateFrom={fakeDate} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitForDomChange();
    expect(getByText('reports_pageranking.more_results'));
  });
});
