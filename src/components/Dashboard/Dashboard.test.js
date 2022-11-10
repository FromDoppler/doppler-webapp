import '@testing-library/jest-dom/extend-expect';
import { getByRole, getByText, render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter as Router } from 'react-router-dom';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { fakeSystemUsageSummary } from '../../services/dashboardService/SystemUsageSummary.double';
import { AppServicesProvider } from '../../services/pure-di';
import { fakeCampaignsSummary, fakeContactsSummary } from '../../services/reports/index.double';
import { Dashboard } from './Dashboard';
import { mapSystemUsageSummary } from './reducers/firstStepsReducer';

const systemUsageSummaryDouble = () => ({
  getSystemUsageSummaryData: async () => ({
    success: true,
    value: fakeSystemUsageSummary,
  }),
});

const dopplerSystemUsageApiClientDouble = () => ({
  getUserSystemUsage: async () => ({
    success: true,
    value: {
      email: 'mail@makingsense.com',
      reportsSectionLastVisit: null,
    },
  }),
});

const reportClientDouble = () => ({
  getCampaignsSummary: async () => ({
    success: true,
    value: fakeCampaignsSummary,
  }),
  getContactsSummary: async () => ({
    success: true,
    value: fakeContactsSummary,
  }),
});

describe('Dashboard component', () => {
  const dependencies = {
    appSessionRef: {
      current: {
        userData: {
          user: {
            fullname: 'Cecilia Bernat',
            plan: {
              isFreeAccount: true,
            },
          },
        },
      },
    },
    reportClient: reportClientDouble(),
    dopplerLegacyClient: {
      getSurveyFormStatus: async () => ({
        success: true,
        value: { surveyFormCompleted: true },
      }),
    },
    systemUsageSummary: systemUsageSummaryDouble(),
    dopplerSystemUsageApiClient: dopplerSystemUsageApiClientDouble(),
  };

  it('should show the hero-banner with personal welcome message', async () => {
    // Act
    await act(async () => {
      render(
        <Router>
          <AppServicesProvider forcedServices={dependencies}>
            <IntlProvider>
              <Dashboard />
            </IntlProvider>
          </AppServicesProvider>
        </Router>,
      );
    });

    // Assert
    expect(screen.getByText(/Cecilia/i)).toBeInTheDocument();
    expect(screen.getByText(/dashboard.welcome_message_header/i)).toBeInTheDocument();
    expect(screen.getAllByRole('figure')).toHaveLength(6);
  });

  it('should render Campaings and Subscribers KpiGroup Component', async () => {
    // Act
    await act(async () => {
      render(
        <Router>
          <AppServicesProvider forcedServices={dependencies}>
            <IntlProvider>
              <Dashboard />
            </IntlProvider>
          </AppServicesProvider>
        </Router>,
      );
    });

    // Assert
    expect(screen.getAllByRole('figure')).toHaveLength(6);
  });

  describe('FirstSteps component', () => {
    it('should render FirstSteps component', async () => {
      // Arrange
      const firstStepsData = mapSystemUsageSummary(fakeSystemUsageSummary);

      // Act
      await act(async () => {
        render(
          <AppServicesProvider forcedServices={dependencies}>
            <IntlProvider>
              <Dashboard />
            </IntlProvider>
          </AppServicesProvider>,
        );
      });

      // Assert
      const firstSteps = firstStepsData.firstSteps;
      const allSteps = screen.getAllByRole('alert', { name: 'step' });
      firstSteps.forEach((step, index) => {
        const node = allSteps[index];
        expect(getByText(node, step.titleId)).toBeInTheDocument();
      });
    });

    it('should mark step 4 as not completed when user has not visited the reports section', async () => {
      // Arrange
      const forcedServices = {
        ...dependencies,
        systemUsageSummary: {
          getSystemUsageSummaryData: async () => ({
            success: true,
            value: {
              hasListsCreated: true,
              hasDomainsReady: true,
              hasCampaingsCreated: true,
              hasCampaingsSent: true,
            },
          }),
        },
        dopplerSystemUsageApiClient: {
          getUserSystemUsage: async () => ({
            success: true,
            value: {
              email: 'mail@makingsense.com',
              reportsSectionLastVisit: null,
            },
          }),
        },
      };

      // Act
      await act(async () => {
        render(
          <AppServicesProvider forcedServices={forcedServices}>
            <IntlProvider>
              <Dashboard />
            </IntlProvider>
          </AppServicesProvider>,
        );
      });

      // Assert
      const allSteps = screen.getAllByRole('alert', { name: 'step' });

      // get last step
      const lastStepNode = allSteps.slice(-1)[0];
      const lastStep = getByRole(lastStepNode, 'heading', {
        level: 4,
        name: 'dashboard.first_steps.has_campaings_sent_title',
      });
      // the last step is incomplete (the step is not crossed)
      expect(lastStep).not.toHaveClass('dp-crossed-text');
    });

    it('should mark step 4 as completed when user has visited the reports section', async () => {
      // Arrange
      const forcedServices = {
        ...dependencies,
        systemUsageSummary: {
          getSystemUsageSummaryData: async () => ({
            success: true,
            value: {
              hasListsCreated: true,
              hasDomainsReady: true,
              hasCampaingsCreated: true,
              hasCampaingsSent: true,
            },
          }),
        },
        dopplerSystemUsageApiClient: {
          getUserSystemUsage: async () => ({
            success: true,
            value: {
              email: 'mail@makingsense.com',
              reportsSectionLastVisit: '2022-10-25T13:39:34.707Z',
            },
          }),
        },
      };

      // Act
      await act(async () => {
        render(
          <AppServicesProvider forcedServices={forcedServices}>
            <IntlProvider>
              <Dashboard />
            </IntlProvider>
          </AppServicesProvider>,
        );
      });

      // Assert
      const allSteps = screen.getAllByRole('alert', { name: 'step' });

      // get last step
      const lastStepNode = allSteps.slice(-1)[0];
      const lastStep = getByRole(lastStepNode, 'heading', {
        level: 4,
        name: 'dashboard.first_steps.has_campaings_sent_title',
      });
      // the last step is completed (the step is crossed)
      expect(lastStep).toHaveClass('dp-crossed-text');
    });

    it('should render unexpected error', async () => {
      // Act
      await act(async () => {
        render(
          <AppServicesProvider
            forcedServices={{
              ...dependencies,
              systemUsageSummary: {
                getSystemUsageSummaryData: async () => ({
                  success: false,
                  error: 'something wrong!',
                }),
              },
            }}
          >
            <IntlProvider>
              <Dashboard />
            </IntlProvider>
          </AppServicesProvider>,
        );
      });

      // Assert
      // because first steps is not visible
      expect(screen.queryByRole('list')).not.toBeInTheDocument();

      // should render unexpected error because the request fail
      screen.getByTestId('unexpected-error');
    });
  });
});
