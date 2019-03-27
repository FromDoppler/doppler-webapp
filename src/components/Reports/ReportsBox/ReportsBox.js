import React from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedDate } from 'react-intl';

class ReportsBox extends React.Component {
  constructor({ dependencies: { datahubClient } }) {
    super();

    /** @type { import('../../services/datahub-client').DatahubClient } */
    this.datahubClient = datahubClient;

    this.state = {
      visits: null,
    };

    this.fetchVisitsByPeriod = this.fetchVisitsByPeriod.bind(this);
  }

  async fetchVisitsByPeriod(domainName, dateFrom) {
    this.asyncRequest = this.datahubClient.getVisitsByPeriod(
      domainName,
      dateFrom,
      this.props.isVisitsWithEmail,
    );
    const visits = await this.asyncRequest;
    this.asyncRequest = null;
    this.setState({
      visits: visits,
    });
  }

  componentWillUnmount() {
    // TODO: abort request or at least side effects after finish
    this.asyncRequest = null;
  }

  componentDidMount() {
    this.fetchVisitsByPeriod(this.props.domainName, this.props.dateFrom);
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.domainName !== state.prevDomainName ||
      props.dateFrom !== state.prevDateFrom ||
      props.dateTo !== state.prevDateTo
    ) {
      return {
        visits: null,
        prevDomainName: props.domainName,
        prevDateFrom: props.dateFrom,
        prevDateTo: props.dateTo,
      };
    }

    // No state update necessary
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.visits === null) {
      this.fetchVisitsByPeriod(this.props.domainName, this.props.dateFrom);
    }
  }

  render() {
    const {
      state: { visits },
      props: { dateFrom, dateTo },
    } = this;

    return (
      <div className={visits === 0 ? 'reports-box warning--kpi' : 'reports-box'}>
        {visits === null ? (
          <div className="loading-box" />
        ) : (
          <>
            <h3 className="number-kpi">{visits}</h3>
            <h6 className="subtitle-kpi">
              {this.props.isVisitsWithEmail ? (
                <FormattedMessage id="reports_box.visits_with_email" />
              ) : (
                <FormattedMessage id="reports_box.visits_without_emails" />
              )}
            </h6>
            <small className="date-range">
              <FormattedDate value={dateFrom} timeZone="UTC" />{' '}
              <FormattedMessage id="reports_box.to" />{' '}
              <FormattedDate value={dateTo} timeZone="UTC" />
            </small>
            <p className="text-kpi">
              <FormattedMessage id="reports_box.visits_description" />
            </p>
          </>
        )}
      </div>
    );
  }
}

export default InjectAppServices(ReportsBox);
