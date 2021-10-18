import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { AppServicesProvider } from '../../services/pure-di';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import '@testing-library/jest-dom/extend-expect';
import { Dashboard, kpiListFake } from './Dashboard';

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
  };
  it('should show the hero-banner with personal welcome message', async () => {
    // Act
    render(
      <Router>
        <AppServicesProvider forcedServices={dependencies}>
          <IntlProvider>
            <Dashboard />
          </IntlProvider>
        </AppServicesProvider>
      </Router>,
    );
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(screen.getByText(/Cecilia/i)).toBeInTheDocument();
    expect(screen.getByText(/dashboard.welcome_message_header/i)).toBeInTheDocument();
  });
  it('should render Campaings and Subscribers KpiGroup Component', async () => {
    //act
    render(
      <Router>
        <AppServicesProvider forcedServices={dependencies}>
          <IntlProvider>
            <Dashboard />
          </IntlProvider>
        </AppServicesProvider>
      </Router>,
    );
    //assert
    expect(screen.getAllByRole('figure')).toHaveLength(
      kpiListFake.Campaings.length + kpiListFake.Subscribers.length,
    );
  });
});
