import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';
import Loading from '../../Loading/Loading';
import {
  Container,
  TrafficSourceContainer,
  TrafficSourceHeader,
} from './ReportsTrafficSources.styles';

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
        <Container>
          {state.loading ? (
            <Loading />
          ) : state.trafficSources ? (
            state.trafficSources.items.map((trafficSource, index) => (
              <TrafficSourceContainer key={index}>
                <TrafficSourceHeader>
                  <h6>
                    <FormattedMessage
                      defaultMessage={trafficSource.sourceName}
                      id={`trafficSources.${trafficSource.sourceName.toLowerCase()}`}
                    />
                  </h6>
                  <span>
                    {trafficSource.quantity} (
                    <span>
                      <FormattedNumber
                        value={trafficSource.quantity / state.trafficSources.total}
                        {...numberFormatOptions}
                      />
                    </span>
                    )
                  </span>
                </TrafficSourceHeader>
              </TrafficSourceContainer>
            ))
          ) : (
            <div className="dp-msj-error bounceIn">
              <p>
                <FormattedMessage id="trafficSources.error" />
              </p>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default InjectAppServices(injectIntl(ReportsTrafficSources));
