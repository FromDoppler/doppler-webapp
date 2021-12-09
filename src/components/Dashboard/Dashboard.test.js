import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter as Router } from 'react-router-dom';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../services/pure-di';
import { fakeCampaignsSummary, fakeContactsSummary } from '../../services/reports/index.double';
import { Dashboard } from './Dashboard';

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
          },
        },
      },
    },
    reportClient: reportClientDouble(),
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
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
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
});
