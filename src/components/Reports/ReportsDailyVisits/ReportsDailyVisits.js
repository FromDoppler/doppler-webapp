import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import Loading from '../../Loading/Loading';
import C3Chart from '../../shared/C3Chart/C3Chart';

const chartDataOptions = {
  json: {},
  type: 'spline',
};

const ReportsDailyVisits = ({ domainName, dateFrom, dependencies: { datahubClient } }) => {
  const [state, setState] = useState({ loading: true });

  const intl = useIntl();

  const [chartConfig] = useState({
    legend: {
      show: false,
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: (x) => {
            return intl.formatDate(x, { timeZone: 'UTC' });
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const dailyVisitsData = await datahubClient.getDailyVisitsByPeriod({
        domainName: domainName,
        dateFrom: dateFrom,
      });
      if (!dailyVisitsData.success) {
        setState({ loading: false });
      } else {
        setState({
          loading: false,
          chartData: {
            json: dailyVisitsData.value,
            keys: {
              x: 'from',
              value: ['quantity'],
            },
          },
        });
      }
    };

    fetchData();
  }, [datahubClient, dateFrom, domainName]);

  return (
    <div className="wrapper-reports-box">
      <div className="reports-box">
        <small className="title-reports-box">
          <FormattedMessage id="reports_daily_visits.title" />
        </small>
        {state.loading ? (
          <Loading />
        ) : !state.chartData ? (
          <div className="dp-msj-error bounceIn">
            <p>
              <FormattedMessage id="trafficSources.error" />
            </p>
          </div>
        ) : (
          <C3Chart config={chartConfig} dataOptions={chartDataOptions} data={state.chartData} />
        )}
      </div>
    </div>
  );
};

export default InjectAppServices(ReportsDailyVisits);
