import React from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedDate } from 'react-intl';
import Loading from '../../Loading/Loading';
import './ReportsBox.css';

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
    if (this.asyncRequest) {
      this.asyncRequest.cancel();
    }
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
      <>
        {visits === null ? (
          <Loading />
        ) : (
          <div className="reports-box--container">
            <p className="title">{visits}</p>
            <small className="text--uppercase">
              {this.props.isVisitsWithEmail ? (
                <FormattedMessage id="reports_box.visits_with_email" />
              ) : (
                <FormattedMessage id="reports_box.visits_without_emails" />
              )}
            </small>
            <p className="small">
              <FormattedDate value={dateFrom} timeZone="UTC" />{' '}
              <FormattedMessage id="reports_box.to" />{' '}
              <FormattedDate value={dateTo} timeZone="UTC" />
            </p>
            <hr />
            <small>
              <FormattedMessage id="reports_box.visits_description" />
            </small>
          </div>
        )}
      </>
    );
  }
}

export default InjectAppServices(ReportsBox);
