import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import Reports from './Reports';
import { AppServicesProvider } from '../../services/pure-di';
import { MemoryRouter as Router } from 'react-router-dom';

const typeformDependencies = {
  appSessionRef: {
    current: {
      userData: {
        user: {
          plan: {
            isFreeAccount: true,
          },
        },
      },
    },
  },
  dopplerLegacyClient: {
    getSurveyFormStatus: async () => ({
      success: true,
      value: { surveyFormCompleted: true },
    }),
  },
};

describe('Reports page', () => {
  afterEach(cleanup);

  it('render page', async () => {
    // Arrange
    const datahubClientDouble = {
      getAccountDomains: async () => [],
      getTotalVisitsOfPeriod: async () => 0,
      getTrafficSourcesByPeriod: async () => [],
      getVisitsQuantitySummarizedByDay: async () => [],
      getVisitsQuantitySummarizedByWeekdayAndHour: async () => [],
      getPagesRankingByPeriod: async () => [],
    };

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: datahubClientDouble,
          ...typeformDependencies,
        }}
      >
        <DopplerIntlProvider>
          <Reports />
        </DopplerIntlProvider>
        ,
      </AppServicesProvider>,
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
      getTotalVisitsOfPeriod: async () => 0,
      getTrafficSourcesByPeriod: async () => [],
      getVisitsQuantitySummarizedByDay: async () => [],
      getVisitsQuantitySummarizedByWeekdayAndHour: async () => [],
      getPagesRankingByPeriod: async () => [],
    };
    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: datahubClientDouble,
          ...typeformDependencies,
        }}
      >
        <DopplerIntlProvider>
          <Reports />
        </DopplerIntlProvider>
      </AppServicesProvider>,
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
    const { queryByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: datahubClientDouble,
          appConfiguration: { dopplerLegacyUrl: 'http://test.localhost' },
          ...typeformDependencies,
        }}
      >
        <DopplerIntlProvider>
          <Reports />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() => expect(queryByText('reports_filters.domain_not_verified_MD')));
  });

  it('should show "no domains" message when the domain list is empty', async () => {
    // Arrange
    const datahubClientDouble = {
      getAccountDomains: () => {
        return { success: true, value: [] };
      },
      getTotalVisitsOfPeriod: async () => 0,
      getTrafficSourcesByPeriod: async () => [],
      getVisitsQuantitySummarizedByDay: async () => [],
      getVisitsQuantitySummarizedByWeekdayAndHour: async () => [],
      getPagesRankingByPeriod: async () => [],
    };

    // Act
    const { container, findByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: datahubClientDouble,
          appConfiguration: { dopplerLegacyUrl: 'http://test.localhost' },
          ...typeformDependencies,
        }}
      >
        <DopplerIntlProvider>
          <Router initialEntries={[`/`]}>
            <Reports />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() => expect(container.querySelectorAll('.loading-box')).toHaveLength(0));
    expect(await findByText('reports.no_domains_MD')).toBeInTheDocument();
  });
});
