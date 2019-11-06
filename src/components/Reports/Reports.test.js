import React from 'react';
import { render, cleanup, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import Reports from './Reports';
import { AppServicesProvider } from '../../services/pure-di';

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
          <Reports
            dependencies={{
              datahubClient: datahubClientDouble,
              appConfiguration: { dopplerLegacyUrl: 'http://test.localhost' },
            }}
          />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
  });

  it('should render domains without pages', async () => {
    const datahubClientDouble = {
      getAccountDomains: async () => fakeData,
      getTotalVisitsOfPeriod: async () => 0,
      getPagesRankingByPeriod: async () => {
        return { success: false, value: [] };
      },
      getTrafficSourcesByPeriod: async () => [],
      getVisitsQuantitySummarizedByPeriod: async () => [],
    };

    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: datahubClientDouble,
          appConfiguration: { dopplerLegacyUrl: 'http://test.localhost' },
        }}
      >
        <DopplerIntlProvider>
          <Reports />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    await wait(() => getByText('reports_filters.verified_domain'));

    const domain = getByText(fakeData[1].name);

    expect(domain).toBeDefined();
  });

  if (
    ('should show verify domain message',
    async () => {
      // Arrange
      const datahubClientDouble = {
        getAccountDomains: async () => ({
          id: 1,
          name: 'www.fromdoppler.com',
          verified_date: null,
        }),
        getTotalVisitsOfPeriod: async () => 0,
        getPagesRankingByPeriod: async () => {
          return { success: false, value: [] };
        },
        getTrafficSourcesByPeriod: async () => [],
        getVisitsQuantitySummarizedByPeriod: async () => [],
      };

      // Act
      const { getByText, container } = render(
        <AppServicesProvider
          forcedServices={{
            datahubClient: datahubClientDouble,
            appConfiguration: { dopplerLegacyUrl: 'http://test.localhost' },
          }}
        >
          <DopplerIntlProvider>
            <Reports />
          </DopplerIntlProvider>
        </AppServicesProvider>,
      );

      // Assert
      await wait(() => expect(container.querySelectorAll('.loading-box')).toHaveLength(0));
      expect(getByText('reports_filters.domain_not_verified_MD'));
    })
  );

  it('should show "no domains" message when the domain list is empty', async () => {
    // Arrange
    let resolveGetAccountDomainsPromise = null;
    const getAccountDomainsPromise = new Promise((r) => {
      resolveGetAccountDomainsPromise = () => r([]);
    });
    const datahubClientDouble = {
      getAccountDomains: () => getAccountDomainsPromise,
      getTotalVisitsOfPeriod: async () => 0,
      getPagesRankingByPeriod: async () => [],
      getPagesTrafficSourcesByPeriod: async () => [],
    };

    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: datahubClientDouble,
          appConfiguration: { dopplerLegacyUrl: 'http://test.localhost' },
        }}
      >
        <DopplerIntlProvider>
          <Reports />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelectorAll('.loading-box')).toHaveLength(1);

    // Act
    resolveGetAccountDomainsPromise();

    // Assert
    await wait(() => expect(container.querySelectorAll('.loading-box')).toHaveLength(0));
    getByText('reports.no_domains_HTML');
  });
});
