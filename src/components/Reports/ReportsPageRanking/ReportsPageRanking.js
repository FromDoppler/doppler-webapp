import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Loading from '../../Loading/Loading';
import { StyledPageRankingItem, StyledParagraph } from './ReportsPageRanking.styles';

const numberFormatOptions = {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const ReportsPageRanking = ({ domainName, dateFrom, dependencies: { datahubClient } }) => {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      const result = await datahubClient.getPagesRankingByPeriod({
        domainName: domainName,
        dateFrom: dateFrom,
      });
      if (!result.success) {
        setState({ loading: false });
      } else {
        setState({
          loading: false,
          pages: result.value,
        });
      }
    };

    fetchData();
  }, [datahubClient, domainName, dateFrom]);

  return (
    <div className="wrapper-reports-box">
      {state.loading ? (
        <Loading />
      ) : (
        <div className="reports-box">
          <small className="title-reports-box">
            <FormattedMessage id="reports_pageranking.top_pages" />
          </small>

          {state.pages ? (
            state.pages.map((item, index) => (
              <StyledPageRankingItem key={index}>
                <div>
                  <StyledParagraph>
                    <strong>{index + 1}</strong>
                  </StyledParagraph>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.name}
                  </a>
                  <StyledParagraph>
                    <strong>{item.totalVisitors}</strong>{' '}
                    <FormattedMessage id="reports_pageranking.total_visits" />
                  </StyledParagraph>
                </div>
                <div className="page-ranking--breakdown">
                  <StyledParagraph color={'#b591c3'}>
                    <FormattedMessage id="reports_pageranking.visits_with_email" />
                  </StyledParagraph>
                  <StyledParagraph>
                    {item.withEmail}(
                    <span>
                      <FormattedNumber
                        value={item.withEmail / item.totalVisitors}
                        {...numberFormatOptions}
                      />
                    </span>
                    )
                  </StyledParagraph>
                  <StyledParagraph color={'#fbb100'} margin={'15px 0 0 0'}>
                    <FormattedMessage id="reports_pageranking.visits_without_email" />
                  </StyledParagraph>
                  <StyledParagraph>
                    {item.totalVisitors - item.withEmail}(
                    <span>
                      <FormattedNumber
                        value={(item.totalVisitors - item.withEmail) / item.totalVisitors}
                        {...numberFormatOptions}
                      />
                    </span>
                    )
                  </StyledParagraph>
                </div>
              </StyledPageRankingItem>
            ))
          ) : (
            <div className="dp-msj-error bounceIn">
              <p>
                <FormattedMessage id="trafficSources.error" />
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InjectAppServices(ReportsPageRanking);
