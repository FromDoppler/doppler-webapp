import React from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedDate } from 'react-intl';

class ReportsBox extends React.Component {
  /**
   * @param { Object } props - props
   * @param { import('../../../services/pure-di').AppServices } props.dependencies
   */
  constructor({ dependencies: { datahubClient } }) {
    super();

    this.datahubClient = datahubClient;

    this.state = {
      visits: null,
    };

    this.fetchVisitsByPeriod = this.fetchVisitsByPeriod.bind(this);
  }

  async fetchVisitsByPeriod(domainName, dateFrom) {
    this.asyncRequest = this.datahubClient.getVisitsByPeriod({
      domainName: domainName,
      dateFrom: dateFrom,
      emailFilter: this.props.withEmail
        ? 'with_email'
        : this.props.withoutEmail
        ? 'without_email'
        : null,
    });
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
        ) : this.props.withEmail ? (
          <>
            <h3 className="number-kpi">{visits}</h3>
            <h6 className="subtitle-kpi">
              <FormattedMessage id="reports_box.visits_with_email" />
            </h6>
            <small className="date-range">
              <FormattedDate value={dateFrom} timeZone="UTC" />{' '}
              <FormattedMessage id="reports_box.to" />{' '}
              <FormattedDate value={dateTo} timeZone="UTC" />
            </small>
            <p className="text-kpi">
              <FormattedMessage id="reports_box.visits_description_with_email" />
            </p>
          </>
        ) : this.props.withoutEmail ? (
          <>
            <h3 className="number-kpi">{visits}</h3>
            <h6 className="subtitle-kpi">
              <FormattedMessage id="reports_box.visits_without_emails" />
            </h6>
            <small className="date-range">
              <FormattedDate value={dateFrom} timeZone="UTC" />{' '}
              <FormattedMessage id="reports_box.to" />{' '}
              <FormattedDate value={dateTo} timeZone="UTC" />
            </small>
            <p className="text-kpi">
              <FormattedMessage id="reports_box.visits_description_without_emails" />
            </p>
          </>
        ) : (
          <span>Unexpected error</span>
        )}
      </div>
    );
  }
}

export default InjectAppServices(ReportsBox);
