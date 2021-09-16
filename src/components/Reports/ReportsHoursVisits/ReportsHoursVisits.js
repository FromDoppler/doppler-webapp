import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedDateParts } from 'react-intl';
import { Loading } from '../../Loading/Loading';
import * as S from './ReportsHoursVisits.styles';
import { prepareFakeVisitsWeekdayHoursData } from '../../../services/datahub-client.doubles';

const createEmptyWeekDayHoursMatrix = () =>
  [...Array(7)].map(() =>
    [...Array(24)].map(() => {
      return {
        qVisitors: 0,
        qVisitorsWithEmail: 0,
        qVisitorsWithOutEmail: 0,
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

const getProcessedVisits = (hoursVisitsdata) => {
  const processedVisits = hoursVisitsdata.value.reduce(
    (accumulator, item) => {
      accumulator.byWeekDayAndHour[item.weekday][item.hour].qVisitors += item.qVisitors;
      if (item.qVisitorsWithEmail || item.qVisitorsWithEmail === 0) {
        accumulator.byWeekDayAndHour[item.weekday][item.hour].qVisitorsWithEmail +=
          item.qVisitorsWithEmail;
        accumulator.byWeekDayAndHour[item.weekday][item.hour].qVisitorsWithOutEmail +=
          item.qVisitorsWithOutEmail;
      }
      if (item.qVisitors > accumulator.max) {
        accumulator.max = item.qVisitors;
      }
      return accumulator;
    },
    { byWeekDayAndHour: createEmptyWeekDayHoursMatrix(), max: 0 },
  );

  return processedVisits;
};

const fakeData = getProcessedVisits({
  success: true,
  value: prepareFakeVisitsWeekdayHoursData(),
});

const ReportsHoursVisitsOld = ({
  domainName,
  dateFrom,
  dateTo,
  dependencies: { datahubClient },
}) => {
  const [state, setState] = useState({
    loading: true,
    visits: fakeData.byWeekDayAndHour,
    minRange: fakeData.max / 3,
    mediumRange: fakeData.max * (2 / 3),
  });

  useEffect(() => {
    if (domainName) {
      const fetchData = async () => {
        setState((state) => ({ ...state, loading: true }));
        const hoursVisitsdata = await datahubClient.getVisitsQuantitySummarizedByWeekdayAndHour({
          domainName: domainName,
          dateFrom: dateFrom,
          dateTo: dateTo,
        });
        if (!hoursVisitsdata.success) {
          setState({ loading: false });
        } else {
          const processedVisits = getProcessedVisits(hoursVisitsdata);
          setState({
            loading: false,
            visits: processedVisits.byWeekDayAndHour,
            minRange: processedVisits.max / 3,
            mediumRange: processedVisits.max * (2 / 3),
          });
        }
      };

      fetchData();
    }
  }, [datahubClient, dateFrom, dateTo, domainName]);

  return (
    <div className="dp-box-shadow">
      <S.Header>
        <div className="col-sm-12 col-md-6">
          <h6 className="title-reports-box">
            <FormattedMessage id="reports_hours_visits.title" />
          </h6>
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
        {state.loading && <Loading />}
        {state.visits ? (
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
                    {item.qVisitors <= state.minRange ? (
                      <>
                        <S.Circle />
                      </>
                    ) : item.qVisitors <= state.mediumRange ? (
                      <S.Circle medium />
                    ) : (
                      <S.Circle big />
                    )}
                    <S.Tooltip className="dp-tooltip-chart">
                      <p>
                        <FormatWeekDayIndex value={weekDayIndex} format={'long'} />{' '}
                        <span>{hour}h</span>
                      </p>
                      {item.qVisitorsWithEmail || item.qVisitorsWithOutEmail ? (
                        <>
                          <span>
                            <FormattedMessage id="reports_hours_visits.users_with_email" />{' '}
                            <span>{item.qVisitorsWithEmail}</span>
                          </span>
                          <span>
                            <FormattedMessage id="reports_hours_visits.users_without_email" />{' '}
                            <span>{item.qVisitorsWithOutEmail}</span>
                          </span>
                        </>
                      ) : (
                        <span>
                          <FormattedMessage id="reports_hours_visits.users" />{' '}
                          <span>{item.qVisitors}</span>
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
          <p className="dp-boxshadow--error bounceIn">
            <FormattedMessage id="common.unexpected_error" />
          </p>
        )}
      </S.ContentContainer>
    </div>
  );
};

export default InjectAppServices(ReportsHoursVisitsOld);
