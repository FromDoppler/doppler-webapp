import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedDateParts } from 'react-intl';
import { Loading } from '../../Loading/Loading';
import * as S from './ReportsHoursVisits.styles';

const createEmptyWeekDayHoursMatrix = () =>
  [...Array(7)].map(() =>
    [...Array(24)].map(() => {
      return {
        quantity: 0,
        withEmail: 0,
        withoutEmail: 0,
      };
    }),
  );

const hoursLegend = [...Array(12)].map((_, index) => {
  return index * 2 + 'h';
});

const FormatWeekDayIndex = ({ value, format }) => {
  return (
    <FormattedDateParts value={new Date(1971, 1, value)} weekday={format}>
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
          accumulator[weekDay][hour].quantity += item.quantity;
          if (item.withEmail || item.withEmail === 0) {
            accumulator[weekDay][hour].withEmail += item.withEmail;
            accumulator[weekDay][hour].withoutEmail += item.withoutEmail;
          }
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
      <div className="reports-box" style={{ width: '900px' }}>
        <S.Header>
          <small className="title-reports-box">
            <FormattedMessage id="reports_hours_visits.title" />
          </small>
          <div>
            <div>
              <div>
                <S.Circle />
              </div>
              <p>
                <FormattedMessage id="reports_hours_visits.few_visits" />
              </p>
            </div>
            <div>
              <div>
                <S.Circle medium />
              </div>
              <p>
                <FormattedMessage id="reports_hours_visits.medium_visits" />
              </p>
            </div>
            <div>
              <div>
                <S.Circle big />
              </div>
              <p>
                <FormattedMessage id="reports_hours_visits.lot_visits" />
              </p>
            </div>
          </div>
        </S.Header>

        {state.loading ? (
          <Loading />
        ) : state.visits ? (
          <S.List>
            {state.visits.map((weekDays, weekDayIndex) => (
              <S.Row key={weekDayIndex}>
                <div className="weekday">
                  <p>
                    <FormatWeekDayIndex value={weekDayIndex} format={'short'} />
                  </p>
                </div>

                {weekDays.map((item, hour) => (
                  <S.Column className="dp-tooltip-container" key={'' + weekDayIndex + '' + hour}>
                    {item.quantity <= 300 ? (
                      <>
                        <S.Circle />
                      </>
                    ) : item.quantity <= 600 ? (
                      <S.Circle medium />
                    ) : (
                      <S.Circle big />
                    )}
                    <S.Tooltip className="dp-tooltip-chart">
                      <p>
                        <FormatWeekDayIndex value={weekDayIndex} format={'long'} />
                        <span>{hour}h</span>
                      </p>
                      {item.withEmail || item.withoutEmail ? (
                        <>
                          <strong>
                            <FormattedMessage id="reports_hours_visits.users_with_email" />{' '}
                            <i>{item.withEmail}</i>
                          </strong>
                          <strong>
                            <FormattedMessage id="reports_hours_visits.users_without_email" />{' '}
                            <i>{item.withoutEmail}</i>
                          </strong>
                        </>
                      ) : (
                        <strong>
                          <FormattedMessage id="reports_hours_visits.users" />{' '}
                          <i>{item.quantity}</i>
                        </strong>
                      )}
                    </S.Tooltip>
                  </S.Column>
                ))}
              </S.Row>
            ))}
            <S.Legend>
              {hoursLegend.map((hour, index) => (
                <span key={index}>{hour}</span>
              ))}
            </S.Legend>
          </S.List>
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
