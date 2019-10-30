import React, { useEffect, useReducer } from 'react';
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

const pageSize = 2;
const initialState = { pages: [], page: 0, loading: true };

const ReportsPageRanking = ({ domainName, dateFrom, dateTo, dependencies: { datahubClient } }) => {
  const [state, dispatchListEvent] = useReducer((prevState, action) => {
    switch (action.type) {
      case 'loadingMore':
        return { ...prevState, loading: true };
      case 'moreLoaded':
        return { pages: [...prevState.pages, ...action.pages], page: prevState.page + 1 };
      case 'errorOnLoad':
        return { ...prevState, loading: false, error: true };
      case 'reset':
      default:
        return initialState;
    }
  }, initialState);

  const fetchData = async (datahubClient, domainName, dateFrom, dateTo, pageNumber) => {
    dispatchListEvent({ type: 'loadingMore' });
    const result = await datahubClient.getPagesRankingByPeriod({
      domainName: domainName,
      dateFrom: dateFrom,
      dateTo: dateTo,
      pageSize: pageSize,
      pageNumber: pageNumber,
    });
    if (!result.success) {
      dispatchListEvent({ type: 'errorOnLoad' });
    } else {
      dispatchListEvent({ type: 'moreLoaded', pages: result.value });
    }
  };

  const showMoreResults = () =>
    fetchData(datahubClient, domainName, dateFrom, dateTo, state.page + 1);

  useEffect(() => {
    fetchData(datahubClient, domainName, dateFrom, dateTo, 1);

    return () => {
      dispatchListEvent({ type: 'reset' });
    };
  }, [datahubClient, domainName, dateFrom, dateTo]);

  return (
    <div className="wrapper-reports-box">
      {state.loading && state.pages.length === 0 ? (
        <Loading />
      ) : (
        <S.ReportBox>
          <small className="title-reports-box">
            <FormattedMessage id="reports_pageranking.top_pages" />
          </small>
          <S.ContentContainer>
            {state.pages.length === 0 ? (
              !state.error ? (
                <BoxMessage className="dp-msj-user bounceIn">
                  <p>
                    <FormattedMessage id="common.empty_data" />
                  </p>
                </BoxMessage>
              ) : (
                <BoxMessage className="dp-msj-error bounceIn">
                  <p>
                    <FormattedMessage id="trafficSources.error" />
                  </p>
                </BoxMessage>
              )
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
                ) : state.error ? (
                  <BoxMessage className="dp-msj-error bounceIn">
                    <p>
                      <FormattedMessage id="trafficSources.error" />
                    </p>
                  </BoxMessage>
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
