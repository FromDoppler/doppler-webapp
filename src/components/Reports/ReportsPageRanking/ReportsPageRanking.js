import React from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage } from 'react-intl';
import Loading from '../../Loading/Loading';
import './ReportsPageRanking.css';

class ReportsPageRanking extends React.Component {
  constructor({ dependencies: { datahubClient } }) {
    super();

    /** @type { import('../../services/datahub-client').DatahubClient } */
    this.datahubClient = datahubClient;

    this.state = {
      pages: null,
    };

    this.fetchPagesRankingByPeriod = this.fetchPagesRankingByPeriod.bind(this);
  }

  async fetchPagesRankingByPeriod(domainName, dateFrom) {
    this.asyncRequest = this.datahubClient.getPagesRankingByPeriod(domainName, dateFrom);
    const pages = await this.asyncRequest;
    this.asyncRequest = null;
    this.setState({
      pages: pages,
    });
  }

  componentWillUnmount() {
    if (this.asyncRequest) {
      this.asyncRequest.cancel();
    }
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
        {pages === null ? (
          <Loading />
        ) : (
          <div className="page-ranking--container">
            <header>
              <FormattedMessage id="reports_pageranking.top_pages" />
            </header>
            {pages.map((item, index) => (
              <div key={index} className="page-ranking--item">
                <strong>{index + 1}</strong>
                <p className="page-name">{item.name}</p>
                <p className="visits">
                  <strong>
                    {item.totalVisits} <FormattedMessage id="reports_pageranking.total_visits" />
                  </strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}

export default InjectAppServices(ReportsPageRanking);
