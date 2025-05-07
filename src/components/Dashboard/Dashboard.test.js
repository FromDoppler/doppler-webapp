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
            sms: {
              smsEnabled: false,
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

  describe('QuickActions component', () => {
    it('should render QuickActions component', async () => {
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
              firstStepsClosedSince: '2022-10-25T14:39:34.707Z',
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
      expect(screen.queryByText('dashboard.first_steps.section_name')).not.toBeInTheDocument();
      expect(screen.queryByTestId('enable-quick-actions')).not.toBeInTheDocument();
      screen.getByText('dashboard.quick_actions.section_name');
      // the SMS option is hide because smsEnabled = false
      expect(screen.queryByText('dashboard.quick_actions.send_sms')).not.toBeInTheDocument();
    });

    it('should render QuickActions component without SMS option', async () => {
      // Arrange
      const forcedServices = {
        ...dependencies,
        appSessionRef: {
          current: {
            userData: {
              user: {
                fullname: 'Cecilia Bernat',
                plan: {
                  isFreeAccount: false,
                },
                sms: {
                  smsEnabled: true,
                },
              },
            },
          },
        },
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
              firstStepsClosedSince: '2022-10-25T14:39:34.707Z',
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
      expect(screen.queryByText('dashboard.first_steps.section_name')).not.toBeInTheDocument();
      expect(screen.queryByTestId('enable-quick-actions')).not.toBeInTheDocument();
      screen.getByText('dashboard.quick_actions.section_name');
      screen.getByText('dashboard.quick_actions.send_sms');
    });
  });
});
