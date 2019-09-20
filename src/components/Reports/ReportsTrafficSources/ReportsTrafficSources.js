import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Loading from '../../Loading/Loading';
import * as S from './ReportsTrafficSources.styles';
import { BoxMessage } from '../../styles/messages';

const ReportsTrafficSources = function({ domainName, dateFrom, dependencies: { datahubClient } }) {
  const [state, setState] = useState({ loading: true });

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
      });
      if (trafficSourcesData.success && trafficSourcesData.value) {
        const total = trafficSourcesData.value.reduce(function(previous, item) {
          return previous + item.quantity;
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
  }, [datahubClient, dateFrom, domainName]);

  return (
    <div className="wrapper-reports-box">
      <div className="reports-box">
        <small className="title-reports-box">
          <FormattedMessage id="trafficSources.title" />
        </small>
        <S.ListContainer>
          {state.loading ? (
            <Loading />
          ) : state.trafficSources ? (
            state.trafficSources.items.map((trafficSource, index) => (
              <S.ListItem key={index}>
                <S.ListItemHeader>
                  <h6>
                    <FormattedMessage
                      defaultMessage={trafficSource.sourceName}
                      id={`trafficSources.${trafficSource.sourceName.toLowerCase()}`}
                    />
                  </h6>
                  <span>
                    {trafficSource.quantity}
                    <span>
                      (
                      <FormattedNumber
                        value={trafficSource.quantity / state.trafficSources.total}
                        {...numberFormatOptions}
                      />
                      )
                    </span>
                  </span>
                </S.ListItemHeader>
                {trafficSource.withEmail || trafficSource.withEmail === 0 ? (
                  <S.ListItemDetail>
                    <div>
                      <div>
                        <p>
                          <FormattedMessage id="trafficSources.users_with_email" />
                        </p>
                        <S.Bar
                          primary
                          style={{
                            width: (trafficSource.withEmail / trafficSource.quantity) * 100 + '%',
                          }}
                        />
                      </div>
                      <span>
                        {trafficSource.withEmail}
                        <span>
                          (
                          <FormattedNumber
                            value={trafficSource.withEmail / trafficSource.quantity}
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
                              ((trafficSource.quantity - trafficSource.withEmail) /
                                trafficSource.quantity) *
                                100 +
                              '%',
                          }}
                        />
                      </div>
                      <span>
                        {trafficSource.withEmail}
                        <span>
                          (
                          <FormattedNumber
                            value={
                              (trafficSource.quantity - trafficSource.withEmail) /
                              trafficSource.quantity
                            }
                            {...numberFormatOptions}
                          />
                          )
                        </span>
                      </span>
                    </div>
                  </S.ListItemDetail>
                ) : null}
              </S.ListItem>
            ))
          ) : (
            <BoxMessage className="dp-msj-error bounceIn">
              <p>
                <FormattedMessage id="trafficSources.error" />
              </p>
            </BoxMessage>
          )}
        </S.ListContainer>
      </div>
    </div>
  );
};

export default InjectAppServices(ReportsTrafficSources);
