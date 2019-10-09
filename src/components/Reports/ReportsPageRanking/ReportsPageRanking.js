import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Loading } from '../../Loading/Loading';
import * as S from './ReportsPageRanking.styles';
import { BoxMessage } from '../../styles/messages';

const numberFormatOptions = {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const ReportsPageRanking = ({ domainName, dateFrom, dependencies: { datahubClient } }) => {
  const [state, setState] = useState({ loading: true, pages: [] });
  const pageSize = 2;
  const [pageNumber, setPageNumber] = useState(1);

  const showMoreResults = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setState((prevState) => ({ loading: true, pages: [...prevState.pages] }));
      const result = await datahubClient.getPagesRankingByPeriod({
        domainName: domainName,
        dateFrom: dateFrom,
        pageSize: pageSize,
        pageNumber: pageNumber,
      });
      if (!result.success) {
        setState({ loading: false });
      } else {
        setState((prevState) => ({
          loading: false,
          pages: [...prevState.pages, ...result.value],
        }));
      }
    };

    fetchData();
  }, [datahubClient, domainName, dateFrom, pageNumber]);

  return (
    <div className="wrapper-reports-box">
      {state.loading && state.pages && state.pages.length === 0 ? (
        <Loading />
      ) : (
        <S.ReportBox>
          <small className="title-reports-box">
            <FormattedMessage id="reports_pageranking.top_pages" />
          </small>
          <S.ContentContainer>
            {!state.pages ? (
              <BoxMessage className="dp-msj-error bounceIn">
                <p>
                  <FormattedMessage id="trafficSources.error" />
                </p>
              </BoxMessage>
            ) : state.pages.length === 0 ? (
              <BoxMessage className="dp-msj-user bounceIn">
                <p>
                  <FormattedMessage id="common.empty_data" />
                </p>
              </BoxMessage>
            ) : (
              <>
                {state.pages.map((item, index) => (
                  <S.ListItem key={index}>
                    <S.ListItemColumn>
                      <p>
                        <strong>{index + 1}</strong>
                      </p>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.name}
                      </a>
                      <p>
                        <strong>{item.totalVisitors}</strong>{' '}
                        <FormattedMessage id="reports_pageranking.total_visits" />
                      </p>
                    </S.ListItemColumn>
                    {item.withEmail || item.withEmail === 0 ? (
                      <S.ListItemRightColumn>
                        <p className="visits--withemail">
                          <FormattedMessage id="reports_pageranking.visits_with_email" />
                        </p>
                        <p>
                          {item.withEmail}(
                          <span>
                            <FormattedNumber
                              value={item.withEmail / item.totalVisitors}
                              {...numberFormatOptions}
                            />
                          </span>
                          )
                        </p>
                        <p className="visits--withoutemail">
                          <FormattedMessage id="reports_pageranking.visits_without_email" />
                        </p>
                        <p>
                          {item.totalVisitors - item.withEmail}(
                          <span>
                            <FormattedNumber
                              value={(item.totalVisitors - item.withEmail) / item.totalVisitors}
                              {...numberFormatOptions}
                            />
                          </span>
                          )
                        </p>
                      </S.ListItemRightColumn>
                    ) : null}
                  </S.ListItem>
                ))}
                {state.loading ? (
                  <S.SpinnerContainer>
                    <Loading />
                  </S.SpinnerContainer>
                ) : state.pages.length === pageSize ? (
                  <S.GridFooter>
                    <button onClick={showMoreResults}>
                      <FormattedMessage id="reports_pageranking.more_results" />
                    </button>
                  </S.GridFooter>
                ) : null}
              </>
            )}
          </S.ContentContainer>
        </S.ReportBox>
      )}
    </div>
  );
};

export default InjectAppServices(ReportsPageRanking);
