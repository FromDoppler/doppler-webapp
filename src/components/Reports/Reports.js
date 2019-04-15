import React from 'react';
import ReportsFilters from './ReportsFilters/ReportsFilters';
import ReportsBox from './ReportsBox/ReportsBox';
import ReportsPageRanking from './ReportsPageRanking/ReportsPageRanking';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

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

  render() {
    return (
      <>
        <FormattedMessage id="reports_title">
          {(message) => {
            if (document.title !== message) {
              document.title = message;
            }

            return null;
          }}
        </FormattedMessage>
        <ReportsFilters
          changeDomain={this.changeDomain}
          domains={this.state.domains}
          domainSelected={this.state.domainSelected}
          periodSelectedDays={this.state.periodSelectedDays}
          changePeriod={this.changePeriod}
        />

        {!this.state.domains ? (
          <div className="loading-box" />
        ) : !this.state.domainSelected ? (
          <section className="container-reports">
            <div className="wrapper-kpi">
              {/* TODO: review this solution, probably styles, content and behavior are wrong */}
              <FormattedHTMLMessage
                className="patch-no-domains"
                id="reports.no_domains_HTML"
                values={{ dopplerBaseUrl: this.appConfiguration.dopplerLegacyUrl }}
              />
            </div>
          </section>
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
            <ReportsPageRanking
              domainName={this.state.domainSelected.name}
              dateTo={this.state.dateTo}
              dateFrom={this.state.dateFrom}
            />
          </section>
        )}
      </>
    );
  }
}

export default InjectAppServices(Reports);
