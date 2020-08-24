import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import Reports from './Reports';
import { AppServicesProvider } from '../../services/pure-di';

describe('Reports page', () => {
  afterEach(cleanup);

  it('render page', async () => {
    // Arrange
    const datahubClientDouble = {
      getAccountDomains: async () => [],
    };
    // Act
    const { getByText } = render(
      <DopplerIntlProvider>
        <Reports
          dependencies={{
            datahubClient: datahubClientDouble,
            appConfiguration: { dopplerLegacyUrl: 'http://test.localhost' },
          }}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    await waitFor(() => expect(getByText('reports_filters.title')));
  });

  it('should show error when dont have domains', async () => {
    // Arrange
    const datahubClientDouble = {
      getAccountDomains: async () => {
        return { success: false };
      },
    };
    // Act
    const { getByText } = render(
      <DopplerIntlProvider>
        <Reports
          dependencies={{
            datahubClient: datahubClientDouble,
            appConfiguration: { dopplerLegacyUrl: 'http://test.localhost' },
          }}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    await waitFor(() => expect(getByText('common.unexpected_error')));
  });

  it('should show verify domain message', async () => {
    // Arrange
    const datahubClientDouble = {
      getAccountDomains: async () => ({
        success: true,
        value: [
          {
            id: 1,
            name: 'www.fromdoppler.com',
            verified_date: null,
          },
        ],
      }),
      getTotalVisitsOfPeriod: async () => 0,
      getTrafficSourcesByPeriod: async () => [],
      getVisitsQuantitySummarizedByDay: async () => [],
      getVisitsQuantitySummarizedByWeekdayAndHour: async () => [],
      getPagesRankingByPeriod: async () => [],
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
    expect(container.querySelectorAll('.loading-box')).toHaveLength(1);
    await waitFor(() => expect(getByText('reports_filters.domain_not_verified_MD')));
  });

  it('should show "no domains" message when the domain list is empty', async () => {
    // Arrange
    const datahubClientDouble = {
      getAccountDomains: () => {
        return { success: true, value: [] };
      },
      getTotalVisitsOfPeriod: async () => 0,
      getTrafficSourcesByPeriod: async () => [],
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
