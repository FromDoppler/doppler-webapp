import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import Loading from '../../Loading/Loading';
import C3Chart from '../../shared/C3Chart/C3Chart';

let chartConfig = {
  data: {
    json: null,
    type: 'spline',
    keys: {
      x: 'from',
      value: ['quantity'],
    },
    xFormat: '%m/%d/%Y',
  },
  legend: {
    show: false,
  },
  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: '%d-%m-%Y',
      },
    },
  },
  color: {
    pattern: ['#B58FC1'],
  },
  point: {
    r: 5,
  },
  grid: {
    x: {
      show: true,
    },
    y: {
      show: true,
    },
  },
};

const ReportsDailyVisits = ({ domainName, dateFrom, dependencies: { datahubClient } }) => {
  const [state, setState] = useState({ loading: true });
  const intl = useIntl();

  useEffect(() => {
    const fetchData = async () => {
      const dailyVisitsData = await datahubClient.getDailyVisitsByPeriod({
        domainName: domainName,
        dateFrom: dateFrom,
      });
      if (!dailyVisitsData.success || !dailyVisitsData.value) {
        setState({ loading: false });
      } else {
        const data = dailyVisitsData.value.map((item) => {
          const date = intl.formatDate(item.from);
          return {
            quantity: item.quantity,
            from: date,
          };
        });
        const chartDataAndOptions = { ...chartConfig, data: { ...chartConfig.data, json: data } };
        setState({
          loading: false,
          chartConfig: chartDataAndOptions,
        });
      }
    };

    fetchData();
  }, [datahubClient, dateFrom, domainName, intl]);

  return (
    <div className="wrapper-reports-box">
      <div className="reports-box">
        <small className="title-reports-box">
          <FormattedMessage id="reports_daily_visits.title" />
        </small>
        {state.loading ? <Loading /> : <C3Chart config={state.chartConfig} />}
      </div>
    </div>
  );
};

export default InjectAppServices(ReportsDailyVisits);
