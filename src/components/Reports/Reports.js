import React from 'react';
import ReportsFilters from './ReportsFilters/ReportsFilters';
import ReportsBox from './ReportsBox/ReportsBox';
import ReportsPageRanking from './ReportsPageRanking/ReportsPageRanking';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessage } from 'react-intl';

class Reports extends React.Component {
  constructor({ dependencies: { datahubClient } }) {
    super();

    /** @type { import('../../services/datahub-client').DatahubClient } */
    this.datahubClient = datahubClient;

    this.state = {
      domains: [],
      domainSelected: null,
      pages: [],
      pageSelected: null,
      periodSelectedDays: 7,
      dateTo: new Date(),
      dateFrom: null,
    };

    this.changeDomain = this.changeDomain.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changePeriod = this.changePeriod.bind(this);
  }

  async componentDidMount() {
    const domains = await this.datahubClient.getAccountDomains();
    if (domains.length) {
      const domainSelected = domains[0];
      const pages = [];
      const pageSelected = pages.length ? pages[0] : null;
      let dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - parseInt(this.state.periodSelectedDays));
      this.setState({
        domains: domains,
        domainSelected: domainSelected,
        pages: pages,
        pageSelected: pageSelected,
        dateFrom: dateFrom,
      });
    }
  }

  changeDomain = async (id) => {
    const domainFound = this.state.domains.find((item) => item.id === id);
    const pages = [];
    const pageSelected = pages.length ? pages[0] : null;
    this.setState({ domainSelected: domainFound, pages: pages, pageSelected: pageSelected });
  };

  changePage = (id) => {
    const pageFound = this.state.pages.find((item) => item.id === id);
    this.setState({ pageSelected: pageFound });
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
          pages={this.state.pages}
          pageSelected={this.state.pageSelected}
          changePage={this.changePage}
          periodSelectedDays={this.state.periodSelectedDays}
          changePeriod={this.changePeriod}
        />

        {this.state.domainSelected ? (
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
        ) : (
          <div className="loading-box" />
        )}
      </>
    );
  }
}

export default InjectAppServices(Reports);
