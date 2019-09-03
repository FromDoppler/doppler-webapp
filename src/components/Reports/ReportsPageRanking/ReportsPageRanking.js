import React from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Loading from '../../Loading/Loading';
import { PageRankingItem, PageRankingItemText, PageRankingBreakdown } from './ReportsPageRanking.styles';

class ReportsPageRanking extends React.Component {
  constructor({ dependencies: { datahubClient } }) {
    super();

    /** @type { import('../../services/datahub-client').DatahubClient } */
    this.datahubClient = datahubClient;

    this.state = {
      pages: null,
    };

    this.numberFormatOptions = {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    this.fetchPagesRankingByPeriod = this.fetchPagesRankingByPeriod.bind(this);
  }

  async fetchPagesRankingByPeriod(domainName, dateFrom) {
    this.asyncRequest = this.datahubClient.getPagesRankingByPeriod({
      domainName: domainName,
      dateFrom: dateFrom,
    });
    const pages = await this.asyncRequest;
    this.asyncRequest = null;
    this.setState({
      pages: pages.value,
    });
  }

  componentWillUnmount() {
    // TODO: abort request or at least side effects after finish
    this.asyncRequest = null;
  }

  componentDidMount() {
    this.fetchPagesRankingByPeriod(this.props.domainName, this.props.dateFrom);
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.domainName !== state.prevDomainName ||
      props.dateFrom !== state.prevDateFrom ||
      props.dateTo !== state.prevDateTo
    ) {
      return {
        pages: null,
        prevDomainName: props.domainName,
        prevDateFrom: props.dateFrom,
        prevDateTo: props.dateTo,
      };
    }

    // No state update necessary
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.pages === null) {
      this.fetchPagesRankingByPeriod(this.props.domainName, this.props.dateFrom);
    }
  }

  render() {
    const {
      state: { pages },
    } = this;

    return (
      <>
        <div className="wrapper-reports-box">
          {pages === null ? (
            <Loading />
          ) : (
            <div className="reports-box">
              <small className="title-reports-box">
                <FormattedMessage id="reports_pageranking.top_pages" />
              </small>

              {pages.map((item, index) => (
                <PageRankingItem key={index}>
                  <div>
                    <PageRankingItemText>
                      <strong>{index + 1}</strong>
                    </PageRankingItemText>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                    <PageRankingItemText>
                      <strong>{item.totalVisitors}</strong>{' '}
                      <FormattedMessage id="reports_pageranking.total_visits" />
                    </PageRankingItemText>
                  </div>
                  <PageRankingBreakdown>
                    <p className="visits--withemail">
                      <FormattedMessage id="reports_pageranking.visits_with_email" />
                    </p>
                    <p>
                      {item.withEmail}(
                      <span>
                        <FormattedNumber
                          value={item.withEmail / item.totalVisitors}
                          {...this.numberFormatOptions}
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
                          {...this.numberFormatOptions}
                        />
                      </span>
                      )
                    </p>
                  </PageRankingBreakdown>
                </PageRankingItem>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
}

export default InjectAppServices(ReportsPageRanking);
