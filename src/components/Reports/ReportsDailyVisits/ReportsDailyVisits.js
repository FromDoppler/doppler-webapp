import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import Loading from '../../Loading/Loading';
import C3Chart from '../../shared/C3Chart/C3Chart';

const chartDataOptions = {
  json: {},
};

const ReportsDailyVisits = ({ domainName, dateFrom, dependencies: { datahubClient } }) => {
  const [state, setState] = useState({ loading: true });

  const intl = useIntl();

  const [chartConfig] = useState({
    legend: {
      show: false,
    },
    tooltip: {
      format: {
        title: (date) => {
          return intl.formatDate(date, {
            timeZone: 'UTC',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
          });
        },
        value: (value, ratio, id) => {
          switch (id) {
            case 'quantity':
              return (
                intl.formatMessage({
                  id: 'reports_daily_visits.tooltip_page_views',
                }) + value
              );
            case 'withEmail':
              return (
                intl.formatMessage({
                  id: 'reports_daily_visits.tooltip_with_email',
                }) + value
              );
            case 'withoutEmail':
              return (
                intl.formatMessage({
                  id: 'reports_daily_visits.tooltip_without_email',
                }) + value
              );
          }
        },
      },
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          culling: false,
          format: (x) => {
            return intl.formatDate(x, { timeZone: 'UTC', month: 'short', day: '2-digit' });
          },
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
      y: {
        show: true,
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const dailyVisitsData = await datahubClient.getVisitsQuantitySummarizedByPeriod({
        domainName: domainName,
        dateFrom: dateFrom,
        periodBy: 'days',
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
              value: ['quantity', 'withEmail', 'withoutEmail'],
            },
            classes: {
              withEmail: 'hide-graph',
              withoutEmail: 'hide-graph',
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
