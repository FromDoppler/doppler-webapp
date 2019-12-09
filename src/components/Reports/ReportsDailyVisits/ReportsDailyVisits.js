import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import { Loading } from '../../Loading/Loading';
import C3Chart from '../../shared/C3Chart/C3Chart';

const chartDataOptions = {
  json: {},
};

const ReportsDailyVisits = ({ domainName, dateFrom, dateTo, dependencies: { datahubClient } }) => {
  const [state, setState] = useState({ loading: true });

  const intl = useIntl();

  const [chartConfig] = useState({
    legend: {
      show: false,
    },
    tooltip: {
      contents: function(data) {
        if (data.length) {
          const date = intl.formatDate(data[0].x, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
          });

          const tooltipData = data.reduce((accumulator, item) => {
            accumulator[item.id] = item.value;
            return accumulator;
          }, {});

          tooltipData.quantity_label = intl.formatMessage({
            id: 'reports_daily_visits.tooltip_page_views',
          });
          tooltipData.withEmail_label = intl.formatMessage({
            id: 'reports_daily_visits.tooltip_with_email',
          });
          tooltipData.withoutEmail_label = intl.formatMessage({
            id: 'reports_daily_visits.tooltip_without_email',
          });

          const valueTemplate = (value) => {
            return `<div class='tooltip-value'>${value}</div>`;
          };

          return `
          <div class="c3-tooltip">
            <div class='tooltip-title'>${date}</div>
            ${
              tooltipData.withEmail == null
                ? valueTemplate(tooltipData.quantity_label + tooltipData.quantity)
                : ''
            }
            ${
              tooltipData.withEmail != null
                ? valueTemplate(tooltipData.withEmail_label + tooltipData.withEmail) +
                  valueTemplate(tooltipData.withoutEmail_label + tooltipData.withoutEmail)
                : ''
            }
          </div>`;
        }
        return '';
      },
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          culling: false,
          format: (x) => {
            return intl.formatDate(x, { month: 'short', day: '2-digit' });
          },
        },
      },
    },
    color: {
      pattern: ['#B58FC1'],
    },
    point: {
      r: 3,
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
        dateTo: dateTo,
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
  }, [datahubClient, dateFrom, dateTo, domainName]);

  return (
    <div className="dp-box-shadow">
      <div className="col-sm-12">
        <small className="title-reports-box">
          <FormattedMessage id="reports_daily_visits.title" />
        </small>
      </div>
      {state.loading ? (
        <Loading />
      ) : !state.chartData ? (
        <p className="dp-boxshadow--error bounceIn">
          <FormattedMessage id="common.unexpected_error" />
        </p>
      ) : (
        <C3Chart config={chartConfig} dataOptions={chartDataOptions} data={state.chartData} />
      )}
    </div>
  );
};

export default InjectAppServices(ReportsDailyVisits);
