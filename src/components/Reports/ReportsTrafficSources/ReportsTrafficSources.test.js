import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReportsTrafficSources from './ReportsTrafficSources';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';

const errorResponse = { success: false, error: new Error('Dummy error') };
const fullResponse = {
  success: true,
  value: [
    {
      sourceType: 'Email',
      qVisits: 2000,
      qVisitsWithEmail: 500,
      qVisitors: 1000,
      qVisitorsWithEmail: 200,
    },
    {
      sourceType: 'Social',
      qVisits: 1000,
      qVisitsWithEmail: 800,
      qVisitors: 500,
      qVisitorsWithEmail: 100,
    },
  ],
};

describe('reports traffic sources', () => {
  afterEach(cleanup);
  it('should deal with DataHub failure', async () => {
    const dataHubClientDouble = {
      getTrafficSourcesByPeriod: async () => errorResponse,
    };

    const domainName = 'doppler.test';
    const dateFrom = new Date('2019-01-01');

    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: dataHubClientDouble,
        }}
      >
        <DopplerIntlProvider locale="es">
          <ReportsTrafficSources domainName={domainName} dateFrom={dateFrom} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitFor(() => {
      expect(getByText('common.unexpected_error'));
    });
  });

  it('should show the traffic sources', async () => {
    const dataHubClientDouble = {
      getTrafficSourcesByPeriod: async () => fullResponse,
    };

    const domainName = 'doppler.test';
    const dateFrom = new Date('2019-01-01');

    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: dataHubClientDouble,
        }}
      >
        <DopplerIntlProvider locale="en">
          <ReportsTrafficSources domainName={domainName} dateFrom={dateFrom} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitFor(() => {
      expect(getByText('trafficSources.email'));
      expect(getByText('trafficSources.social'));
    });
  });
});
