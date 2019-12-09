import React from 'react';
import { render, cleanup, waitForDomChange } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReportsHoursVisits from './ReportsHoursVisits';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';

const errorResponse = { success: false, error: new Error('Dummy error') };
const domainName = 'doppler.test';
const dateFrom = new Date('2019-01-01');
const dateTo = new Date('2019-01-07');

const getFakeHoursVisitsData = () => {
  let date = dateFrom;
  return {
    success: true,
    value: [...Array(168)].map((index) => {
      date.setHours(date.getHours() + 1);
      return {
        periodNumber: index,
        from: date,
        to: date,
        quantity: Math.floor(Math.random() * 1000),
        withEmail: 1,
        withoutEmail: 0,
      };
    }),
  };
};

describe('reports weekday and hours visits', () => {
  afterEach(cleanup);

  it('should deal with DataHub failure', async () => {
    // Arrange
    const dataHubClientDouble = {
      getVisitsQuantitySummarizedByPeriod: async () => errorResponse,
    };

    // Act
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: dataHubClientDouble,
        }}
      >
        <DopplerIntlProvider locale="es">
          <ReportsHoursVisits domainName={domainName} dateFrom={dateFrom} dateTo={dateTo} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitForDomChange();
    expect(getByText('common.unexpected_error'));
  });

  it('should show the graphic with the data', async () => {
    // Arrange
    const dataHubClientDouble = {
      getVisitsQuantitySummarizedByPeriod: async () => getFakeHoursVisitsData(),
    };

    // Act
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: dataHubClientDouble,
        }}
      >
        <DopplerIntlProvider locale="en">
          <ReportsHoursVisits domainName={domainName} dateFrom={dateFrom} dateTo={dateTo} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitForDomChange();
  });

  it('should show the graphic and check specific data', async () => {
    // Arrange
    const fakeHoursVisits = {
      success: true,
      value: [
        {
          periodNumber: 0,
          from: new Date(),
          to: new Date(),
          quantity: 593,
          withEmail: 0,
          withoutEmail: 0,
        },
      ],
    };

    const dataHubClientDouble = {
      getVisitsQuantitySummarizedByPeriod: async () => fakeHoursVisits,
    };

    // Act
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: dataHubClientDouble,
        }}
      >
        <DopplerIntlProvider locale="en">
          <ReportsHoursVisits domainName={domainName} dateFrom={dateFrom} dateTo={dateTo} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitForDomChange();
    expect(getByText('593'));
  });

  it('should show the graphic with user with email', async () => {
    // Arrange
    const fakeHoursVisits = {
      success: true,
      value: [
        {
          periodNumber: 0,
          from: new Date(),
          to: new Date(),
          quantity: 593,
          withEmail: 200,
          withoutEmail: 0,
        },
      ],
    };

    const dataHubClientDouble = {
      getVisitsQuantitySummarizedByPeriod: async () => fakeHoursVisits,
    };

    // Act
    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          datahubClient: dataHubClientDouble,
        }}
      >
        <DopplerIntlProvider locale="en">
          <ReportsHoursVisits domainName={domainName} dateFrom={dateFrom} dateTo={dateTo} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitForDomChange();
    expect(getByText('200'));
  });
});
