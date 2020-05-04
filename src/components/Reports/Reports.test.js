import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import Reports from './Reports';
import { AppServicesProvider } from '../../services/pure-di';

const verifiedDateAsDate = new Date('2017-12-17');

const fakeData = {
  success: true,
  value: [
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
  ],
};

const fakePages = [
  { id: 1, name: 'productos2' },
  { id: 2, name: 'servicios2' },
];

describe('Reports page', () => {
  afterEach(cleanup);

  it('render page without domain', async () => {
    // Arrange
    const datahubClientDouble = {
      getAccountDomains: async () => {
        return { success: true, value: [] };
      },
    };

    // Act
    const { getByText } = render(
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

    // Assert
    await waitFor(() => expect(getByText('reports.no_domains_MD')));
  });

  it('should render domains without pages', async () => {
    const datahubClientDouble = {
      getAccountDomains: async () => fakeData,
      getTotalVisitsOfPeriodOld: async () => 0,
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

    await waitFor(() => getByText('reports_filters.verified_domain'));

    const domain = getByText(fakeData.value[1].name);

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
        getTotalVisitsOfPeriodOld: async () => 0,
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
      await waitFor(() => expect(container.querySelectorAll('.loading-box')).toHaveLength(0));
      expect(getByText('reports_filters.domain_not_verified_MD'));
    })
  );

  it('should show "no domains" message when the domain list is empty', async () => {
    // Arrange
    const datahubClientDouble = {
      getAccountDomains: () => {
        return { success: true, value: [] };
      },
      getTotalVisitsOfPeriodOld: async () => 0,
      getPagesRankingByPeriod: async () => [],
      getPagesTrafficSourcesByPeriod: async () => [],
    };

    // Act
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

    // Assert
    await waitFor(() => expect(container.querySelectorAll('.loading-box')).toHaveLength(0));
    getByText('reports.no_domains_MD');
  });
});
