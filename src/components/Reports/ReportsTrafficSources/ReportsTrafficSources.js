import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';
import Loading from '../../Loading/Loading';
import {Container, TrafficSourceContainer, TrafficSourceHeader} from './ReportsTrafficSources.styles';

const ReportsTrafficSources = function({
  domainName,
  dateFrom,
  intl,
  dependencies: { datahubClient },
}) {
  const [state, setState] = useState({ loading: true });

  const numberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  useEffect(() => {
    const fetchData = async () => {
      const trafficSourcesData = await datahubClient.getTrafficSourcesByPeriod(
        domainName,
        dateFrom,
      );
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
    <div className="wrapper-ranking">
      <div className="reports-box">
        <h4 className="title-ranking">
          <FormattedMessage id="trafficSources.title" />
        </h4>
        <Container>
          {state.loading ? (
            <Loading />
          ) : state.trafficSources ? (
            state.trafficSources.items.map((trafficSource, index) => (
              <TrafficSourceContainer key={index}>
                <TrafficSourceHeader>
                  <h6>{trafficSource.sourceName}</h6>
                  <span>
                    {trafficSource.quantity} (
                    <FormattedNumber
                      value={trafficSource.quantity / state.trafficSources.total}
                      {...numberFormatOptions}
                    />
                    )
                  </span>
                </TrafficSourceHeader>
                  
              </TrafficSourceContainer>
              // TODO: Add message or something more prettier when service fail
            ))
          ) : (
            <FormattedMessage id="trafficSources.error" />
          )}
        </Container>
      </div>
    </div>
  );
};

export default InjectAppServices(injectIntl(ReportsTrafficSources));
