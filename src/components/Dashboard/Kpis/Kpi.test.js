import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Kpi } from './Kpi';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('Kpi component', () => {
  it('should render Kpi Component', async () => {
    // Arrange
    const fakeKpi = {
      kpiTitleId: 'dashboard.campaigns.totalCampaigns',
      kpiValue: 21.478,
      iconClass: 'deliveries',
    };

    // Act
    render(
      <IntlProvider>
        <Kpi {...fakeKpi} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByRole('figure')).toBeInTheDocument();
    expect(screen.getByText(fakeKpi.kpiTitleId)).toBeInTheDocument();
    expect(screen.getByText(fakeKpi.kpiValue)).toBeInTheDocument();
  });

  it('should render Kpi Component with preiod custom', async () => {
    // Arrange
    const fakeKpi = {
      kpiTitleId: 'dashboard.campaigns.totalOpen',
      kpiValue: '57%',
      iconClass: 'open-rate',
      kpiPeriodId: 'dashboard.total',
    };

    // Act
    render(
      <IntlProvider>
        <Kpi {...fakeKpi} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByRole('figure')).toBeInTheDocument();
    expect(screen.getByText(fakeKpi.kpiPeriodId)).toBeInTheDocument();
  });
});
