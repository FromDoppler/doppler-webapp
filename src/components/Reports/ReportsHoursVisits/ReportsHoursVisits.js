import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedDateParts } from 'react-intl';
import Loading from '../../Loading/Loading';

const createEmptyWeekDayHoursMatrix = () => [...Array(7)].map(() => [...Array(24)].map(() => 0));

const FormatWeekDayIndex = ({ value }) => {
  return (
    <FormattedDateParts value={new Date(1971, 1, value)} weekday="short">
      {(parts) => <span>{parts[0].value}</span>}
    </FormattedDateParts>
  );
};

const ReportsHoursVisits = ({ domainName, dateFrom, dependencies: { datahubClient } }) => {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const hoursVisitsdata = await datahubClient.getVisitsQuantitySummarizedByPeriod({
        domainName: domainName,
        dateFrom: dateFrom,
        periodBy: 'hours',
      });
      if (!hoursVisitsdata.success) {
        setState({ loading: false });
      } else {
        const visitsByWeekDayAndHour = hoursVisitsdata.value.reduce((accumulator, item) => {
          const weekDay = item.from.getUTCDay();
          const hour = item.from.getUTCHours();
          accumulator[weekDay][hour] += item.quantity;
          return accumulator;
        }, createEmptyWeekDayHoursMatrix());
        setState({
          loading: false,
          visits: visitsByWeekDayAndHour,
        });
      }
    };

    fetchData();
  }, [datahubClient, dateFrom, domainName]);

  return (
    <div className="wrapper-reports-box">
      <div className="reports-box">
        <small className="title-reports-box">
          <FormattedMessage id="reports_hours_visits.title" />
        </small>
        {state.loading ? (
          <Loading />
        ) : state.visits ? (
          <div>
            {state.visits.map((weekDays, weekDayIndex) => (
              <div key={weekDayIndex}>
                <span>
                  <FormatWeekDayIndex value={weekDayIndex} /> - - -
                </span>
                {weekDays.map((quantity, hour) => (
                  <div style={{ display: 'inline-block' }} key={'' + weekDayIndex + '' + hour}>
                    {quantity}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="dp-msj-error bounceIn">
            <p>
              <FormattedMessage id="trafficSources.error" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InjectAppServices(ReportsHoursVisits);
