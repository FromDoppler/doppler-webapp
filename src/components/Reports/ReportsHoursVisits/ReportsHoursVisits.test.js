import { render, cleanup, waitFor, screen } from '@testing-library/react';
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
  return [...Array(168)].map((index) => {
    date.setHours(date.getHours() + 1);
    return {
      periods: [
        {
          from: date.toString(),
          to: date.toString(),
        },
      ],
      qVisitors: Math.floor(Math.random() * 1000),
      qVisitorsWithEmail: 1,
      qVisits: Math.floor(Math.random() * 1000 + 1000),
      qVisitsWithEmail: Math.floor(Math.random() * 100),
    };
  });
};

describe('reports weekday and hours visits', () => {
  afterEach(cleanup);

  it('should deal with DataHub failure', async () => {
    // Arrange
    const dataHubClientDouble = {
      getVisitsQuantitySummarizedByWeekdayAndHour: async () => errorResponse,
    };

    // Act
    const { container } = render(
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
    await waitFor(() => expect(screen.queryByText('common.unexpected_error')).toBeInTheDocument());
  });

  it('should show the graphic with the data', async () => {
    // Arrange
    const dataHubClientDouble = {
      getVisitsQuantitySummarizedByWeekdayAndHour: async () => getFakeHoursVisitsData(),
    };

    // Act
    const { container } = render(
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
    await waitFor(() => {
      expect(container.querySelector('.loading-box')).not.toBeInTheDocument();
    });
  });

  it('should show the graphic and check specific data', async () => {
    // Arrange
    const fakeHoursVisits = {
      success: true,
      value: [
        {
          weekday: 0,
          hour: 0,
          qVisitors: 593,
          qVisitorsWithEmail: 0,
          qVisitorsWithOutEmail: 0,
          qVisits: 800,
          qVisitsWithEmail: 100,
        },
      ],
    };

    const dataHubClientDouble = {
      getVisitsQuantitySummarizedByWeekdayAndHour: async () => fakeHoursVisits,
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
    await waitFor(() => expect(getByText('593')));
  });

  it('should show the graphic with user with email', async () => {
    // Arrange
    const fakeHoursVisits = {
      success: true,
      value: [
        {
          weekday: 0,
          hour: 0,
          qVisitors: 593,
          qVisitorsWithEmail: 50,
          qVisitorsWithOutEmail: 2,
          qVisits: 800,
          qVisitsWithEmail: 100,
        },
      ],
    };

    const dataHubClientDouble = {
      getVisitsQuantitySummarizedByWeekdayAndHour: async () => fakeHoursVisits,
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
    await waitFor(() => expect(getByText('50')));
  });
});
