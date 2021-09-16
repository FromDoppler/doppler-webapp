import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Loading } from '../../Loading/Loading';
import * as S from './ReportsTrafficSources.styles';
import { fakeTrafficSourcesData } from '../../../services/datahub-client.doubles';

const SafeDivide = (number, qVisitors) => {
  return qVisitors ? number / qVisitors : 0;
};

const ReportsTrafficSources = function ({
  domainName,
  dateFrom,
  dateTo,
  dependencies: { datahubClient },
}) {
  const [state, setState] = useState({
    loading: true,
    trafficSources: { items: fakeTrafficSourcesData },
  });

  const numberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  useEffect(() => {
    const fetchData = async () => {
      const trafficSourcesData = await datahubClient.getTrafficSourcesByPeriod({
        domainName: domainName,
        dateFrom: dateFrom,
        dateTo: dateTo,
      });
      if (trafficSourcesData.success && trafficSourcesData.value) {
        const total = trafficSourcesData.value.reduce(function (previous, item) {
          return previous + item.qVisitors;
        }, 0);
        setState({
          loading: false,
          trafficSources: { total: total, items: trafficSourcesData.value },
        });
      } else {
        setState({ loading: false });
      }
    };

    fetchData();
  }, [datahubClient, dateFrom, domainName, dateTo]);

  return (
    <div className="dp-box-shadow">
      <div>
        <h6 className="title-reports-box">
          <FormattedMessage id="trafficSources.title" />
        </h6>
      </div>
      <S.ContentContainer>
        {state.loading && <Loading />}
        {!state.loading && !state.trafficSources ? (
          <p className="dp-boxshadow--error bounceIn">
            <FormattedMessage id="common.unexpected_error" />
          </p>
        ) : state.trafficSources.items.length === 0 ? (
          <p className="dp-boxshadow--usermsg bounceIn">
            <FormattedMessage id="common.empty_data" />
          </p>
        ) : (
          <S.ListContainer>
            {state.trafficSources.items.map((trafficSource, index) => (
              <S.ListItem key={index} className="col-md-4 col-sm-12">
                <S.ListItemHeader>
                  <p>
                    <FormattedMessage
                      defaultMessage={trafficSource.sourceType}
                      id={`trafficSources.${trafficSource.sourceType.toLowerCase()}`}
                    />
                  </p>
                  <span>
                    {trafficSource.qVisitors}
                    <span>
                      (
                      <FormattedNumber
                        value={SafeDivide(trafficSource.qVisitors, state.trafficSources.total)}
                        {...numberFormatOptions}
                      />
                      )
                    </span>
                  </span>
                </S.ListItemHeader>
                {trafficSource.qVisitorsWithEmail || trafficSource.qVisitorsWithEmail === 0 ? (
                  <S.ListItemDetail>
                    <div>
                      <div>
                        <p>
                          <FormattedMessage id="trafficSources.users_with_email" />
                        </p>
                        <S.Bar
                          primary
                          style={{
                            width:
                              SafeDivide(
                                trafficSource.qVisitorsWithEmail,
                                trafficSource.qVisitors,
                              ) *
                                100 +
                              '%',
                          }}
                        />
                      </div>
                      <span>
                        {trafficSource.qVisitorsWithEmail}
                        <span>
                          (
                          <FormattedNumber
                            value={SafeDivide(
                              trafficSource.qVisitorsWithEmail,
                              trafficSource.qVisitors,
                            )}
                            {...numberFormatOptions}
                          />
                          )
                        </span>
                      </span>
                    </div>
                    <div>
                      <div>
                        <p>
                          <FormattedMessage id="trafficSources.users_without_email" />
                        </p>
                        <S.Bar
                          style={{
                            width:
                              SafeDivide(
                                trafficSource.qVisitors - trafficSource.qVisitorsWithEmail,
                                trafficSource.qVisitors,
                              ) *
                                100 +
                              '%',
                          }}
                        />
                      </div>
                      <span>
                        {trafficSource.qVisitors - trafficSource.qVisitorsWithEmail}
                        <span>
                          (
                          <FormattedNumber
                            value={SafeDivide(
                              trafficSource.qVisitors - trafficSource.qVisitorsWithEmail,
                              trafficSource.qVisitors,
                            )}
                            {...numberFormatOptions}
                          />
                          )
                        </span>
                      </span>
                    </div>
                  </S.ListItemDetail>
                ) : null}
              </S.ListItem>
            ))}
          </S.ListContainer>
        )}
      </S.ContentContainer>
    </div>
  );
};

export default InjectAppServices(ReportsTrafficSources);
