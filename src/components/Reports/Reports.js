import React from 'react';
import ReportsFilters from './ReportsFilters/ReportsFilters';
import ReportsBox from './ReportsBox/ReportsBox';
import ReportsPageRanking from './ReportsPageRanking/ReportsPageRanking';
import ReportsTrafficSources from './ReportsTrafficSources/ReportsTrafficSources';
import ReportsDailyVisits from './ReportsDailyVisits/ReportsDailyVisits';
import ReportsHoursVisits from './ReportsHoursVisits/ReportsHoursVisits';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessage } from 'react-intl';
import {
  SiteTrackingRequired,
  SiteTrackingNotAvailableReasons,
} from '../SiteTrackingRequired/SiteTrackingRequired';
import { Helmet } from 'react-helmet';
import { Loading } from '../Loading/Loading';

class Reports extends React.Component {
  /**
   * @param { Object } props
   * @param { import('../../services/pure-di').AppServices } props.dependencies
   */
  constructor({ dependencies: { datahubClient, appConfiguration } }) {
    super();

    this.datahubClient = datahubClient;
    this.appConfiguration = appConfiguration;

    this.state = {
      domains: null,
      domainSelected: null,
      periodSelectedDays: 7,
      dateTo: new Date(),
      dateFrom: null,
    };

    this.changeDomain = this.changeDomain.bind(this);
    this.changePeriod = this.changePeriod.bind(this);
  }

  async componentDidMount() {
    const domains = await this.datahubClient.getAccountDomains();
    const domainSelected = domains.length ? domains[0] : null;
    let dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(this.state.periodSelectedDays));
    this.setState({
      domains: domains,
      domainSelected: domainSelected,
      dateFrom: dateFrom,
    });
  }

  changeDomain = async (name) => {
    const domainFound = this.state.domains.find((item) => item.name === name);
    this.setState({ domainSelected: domainFound });
  };

  changePeriod = (days) => {
    let dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);
    this.setState({ periodSelectedDays: days, dateFrom: dateFrom, dateTo: new Date() });
  };

  render = () => (
    <>
      <FormattedMessage id="reports_title">
        {(reports_title) => (
          <Helmet>
            <title>{reports_title}</title>
          </Helmet>
        )}
      </FormattedMessage>
      {this.state.domains && !this.state.domainSelected ? (
        <SiteTrackingRequired reason={SiteTrackingNotAvailableReasons.thereAreNotDomains} />
      ) : (
        <>
          <ReportsFilters
            changeDomain={this.changeDomain}
            domains={this.state.domains}
            domainSelected={this.state.domainSelected}
            periodSelectedDays={this.state.periodSelectedDays}
            changePeriod={this.changePeriod}
          />
          {!this.state.domains ? (
            <Loading />
          ) : (
            <section className="container-reports">
              <div className="wrapper-kpi">
                <ReportsBox
                  domainName={this.state.domainSelected.name}
                  periodSelectedDays={this.state.periodSelectedDays}
                  dateTo={this.state.dateTo}
                  dateFrom={this.state.dateFrom}
                  withoutEmail
                />
                <ReportsBox
                  domainName={this.state.domainSelected.name}
                  dateTo={this.state.dateTo}
                  dateFrom={this.state.dateFrom}
                  withEmail
                />
              </div>
              <ReportsDailyVisits
                domainName={this.state.domainSelected.name}
                dateFrom={this.state.dateFrom}
              />
              <ReportsTrafficSources
                domainName={this.state.domainSelected.name}
                dateFrom={this.state.dateFrom}
              />
              <ReportsHoursVisits
                domainName={this.state.domainSelected.name}
                dateTo={this.state.dateTo}
                dateFrom={this.state.dateFrom}
              />
              <ReportsPageRanking
                domainName={this.state.domainSelected.name}
                dateTo={this.state.dateTo}
                dateFrom={this.state.dateFrom}
              />
            </section>
          )}
        </>
      )}
    </>
  );
}

export default InjectAppServices(Reports);
