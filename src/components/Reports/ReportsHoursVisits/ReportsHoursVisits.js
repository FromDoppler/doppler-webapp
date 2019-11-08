import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedDateParts } from 'react-intl';
import { Loading } from '../../Loading/Loading';
import * as S from './ReportsHoursVisits.styles';
import { BoxMessage } from '../../styles/messages';

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

const ReportsHoursVisits = ({ domainName, dateFrom, dateTo, dependencies: { datahubClient } }) => {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const hoursVisitsdata = await datahubClient.getVisitsQuantitySummarizedByPeriod({
        domainName: domainName,
        dateFrom: dateFrom,
        dateTo: dateTo,
        periodBy: 'hours',
      });
      if (!hoursVisitsdata.success) {
        setState({ loading: false });
      } else {
        const processedVisits = hoursVisitsdata.value.reduce(
          (accumulator, item) => {
            const weekDay = item.from.getDay();
            const hour = item.from.getHours();
            accumulator.byWeekDayAndHour[weekDay][hour].quantity += item.quantity;
            if (item.withEmail || item.withEmail === 0) {
              accumulator.byWeekDayAndHour[weekDay][hour].withEmail += item.withEmail;
              accumulator.byWeekDayAndHour[weekDay][hour].withoutEmail += item.withoutEmail;
            }
            if (item.quantity > accumulator.max) {
              accumulator.max = item.quantity;
            }
            return accumulator;
          },
          { byWeekDayAndHour: createEmptyWeekDayHoursMatrix(), max: 0 },
        );
        setState({
          loading: false,
          visits: processedVisits.byWeekDayAndHour,
          minRange: processedVisits.max / 3,
          mediumRange: processedVisits.max * (2 / 3),
        });
      }
    };

    fetchData();
  }, [datahubClient, dateFrom, dateTo, domainName]);

  return (
    <div className="dp-box-shadow">
      <S.Header>
        <div className="col-sm-12 col-md-6">
          <small className="title-reports-box">
            <FormattedMessage id="reports_hours_visits.title" />
          </small>
        </div>
        <div className="col-sm-12 col-md-6 dp-reference">
          <div>
            <div>
              <S.Circle />
            </div>
            <p>
              <FormattedMessage
                id="reports_hours_visits.few_visits"
                values={{ max: Math.floor(state.minRange) }}
              />
            </p>
          </div>
          <div>
            <div>
              <S.Circle medium />
            </div>
            <p>
              <FormattedMessage
                id="reports_hours_visits.medium_visits"
                values={{ min: Math.floor(state.minRange), max: Math.floor(state.mediumRange) }}
              />
            </p>
          </div>
          <div>
            <div>
              <S.Circle big />
            </div>
            <p>
              <FormattedMessage
                id="reports_hours_visits.lot_visits"
                values={{ min: Math.floor(state.mediumRange) }}
              />
            </p>
          </div>
        </div>
      </S.Header>
      <S.ContentContainer>
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
                    {item.quantity <= state.minRange ? (
                      <>
                        <S.Circle />
                      </>
                    ) : item.quantity <= state.mediumRange ? (
                      <S.Circle medium />
                    ) : (
                      <S.Circle big />
                    )}
                    <S.Tooltip className="dp-tooltip-chart">
                      <p>
                        <FormatWeekDayIndex value={weekDayIndex} format={'long'} />{' '}
                        <span>{hour}h</span>
                      </p>
                      {item.withEmail || item.withoutEmail ? (
                        <>
                          <span>
                            <FormattedMessage id="reports_hours_visits.users_with_email" />{' '}
                            <span>{item.withEmail}</span>
                          </span>
                          <span>
                            <FormattedMessage id="reports_hours_visits.users_without_email" />{' '}
                            <span>{item.withoutEmail}</span>
                          </span>
                        </>
                      ) : (
                        <span>
                          <FormattedMessage id="reports_hours_visits.users" />{' '}
                          <span>{item.quantity}</span>
                        </span>
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
          <BoxMessage className="dp-msj-error bounceIn">
            <p>
              <FormattedMessage id="trafficSources.error" />
            </p>
          </BoxMessage>
        )}
      </S.ContentContainer>
    </div>
  );
};

export default InjectAppServices(ReportsHoursVisits);
