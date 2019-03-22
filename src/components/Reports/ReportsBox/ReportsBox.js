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
      isLoading: true,
      dateTo: new Date(),
    };

    this.getVisitsByPeriod = this.getVisitsByPeriod.bind(this);
  }

  async getVisitsByPeriod(domainName, periodSelectedDays) {
    let dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(periodSelectedDays));

    const visits = await this.datahubClient.getVisitsByPeriod(domainName, dateFrom);
    this.setState({
      visits: visits,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(),
      isLoading: false,
    });
  }

  componentDidMount() {
    this.getVisitsByPeriod(this.props.domainName, this.props.periodSelectedDays);
  }

  componentWillReceiveProps(nextProps) {
    this.getVisitsByPeriod(nextProps.domainName, nextProps.periodSelectedDays);
  }

  render() {
    const {
      state: { visits, dateFrom, dateTo, isLoading },
    } = this;

    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="reports-box--container">
            <p className="title">{visits}</p>
            <small className="text--uppercase">
              <FormattedMessage id="reports_box.visits" />
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
