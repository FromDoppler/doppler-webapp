import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, injectIntl } from 'react-intl';
import Loading from '../../Loading/Loading';

const ReportsTrafficSources = function({
  domainName,
  dateFrom,
  intl,
  dependencies: { datahubClient },
}) {
  const [trafficSources, setTrafficSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const trafficSourcesData = await datahubClient.getTrafficSourcesByPeriod(
        domainName,
        dateFrom,
      );
      setTrafficSources(trafficSourcesData);
      let total = 0;
      trafficSources.forEach((item, index) => {
        total += item.quantity;
      });
      setTotalQuantity(total);
      setIsLoading(false);
    };

    fetchData();
  }, [datahubClient, dateFrom, domainName, trafficSources]);

  return (
    <div className="wrapper-ranking">
      <div className="reports-box">
        <h4 className="title-ranking">
          <FormattedMessage id="trafficSources.title" />
        </h4>
        <div>
          {isLoading ? (
            <Loading />
          ) : (
            trafficSources.map((trafficSource, index) => (
              <div key={index}>
                <span>{trafficSource.sourceName}</span>
                <span>{trafficSource.quantity}</span>
                <span>({(trafficSource.quantity * 100) / totalQuantity})</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InjectAppServices(injectIntl(ReportsTrafficSources));
