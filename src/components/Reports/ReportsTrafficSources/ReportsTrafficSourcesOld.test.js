import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReportsTrafficSourcesOld from './ReportsTrafficSourcesOld';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';

const errorResponse = { success: false, error: new Error('Dummy error') };
const fullResponse = {
  success: true,
  value: [
    {
      sourceName: 'Email',
      quantity: 2000,
    },
    {
      sourceName: 'Social',
      quantity: 1000,
    },
  ],
};

describe('reports traffic sources', () => {
  afterEach(cleanup);
  it('should deal with DataHub failure', async () => {
    const dataHubClientDouble = {
      getTrafficSourcesByPeriodOld: async () => errorResponse,
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
          <ReportsTrafficSourcesOld domainName={domainName} dateFrom={dateFrom} />
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
      getTrafficSourcesByPeriodOld: async () => fullResponse,
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
          <ReportsTrafficSourcesOld domainName={domainName} dateFrom={dateFrom} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitFor(() => {
      expect(getByText('trafficSources.email'));
      expect(getByText('trafficSources.social'));
      // TODO: for now only can check english language local because for local has small-icu and need full-icu
      expect(getByText('(66.67%)'));
    });
  });
});
