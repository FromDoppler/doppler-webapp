import React from 'react';
import ReportsFilters from './ReportsFilters/ReportsFilters';
import { InjectAppServices } from '../../services/pure-di';

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
    };

    this.changeDomain = this.changeDomain.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  async componentDidMount() {
    const domains = await this.datahubClient.getAccountDomains();
    if (domains.length) {
      const domainSelected = domains[0];
      const pages = await this.datahubClient.getPagesByDomainId(domainSelected.id);
      const pageSelected = pages.length ? pages[0] : null;
      this.setState({
        domains: domains,
        domainSelected: domainSelected,
        pages: pages,
        pageSelected: pageSelected,
      });
    }
  }

  changeDomain = async (id) => {
    const domainFound = this.state.domains.find((item) => item.id === id);
    const pages = await this.datahubClient.getPagesByDomainId(id);
    const pageSelected = pages.length ? pages[0] : null;
    this.setState({ domainSelected: domainFound, pages: pages, pageSelected: pageSelected });
  };

  changePage = (id) => {
    const pageFound = this.state.pages.find((item) => item.id === id);
    this.setState({ pageSelected: pageFound });
  };

  render() {
    return (
      <>
        <ReportsFilters
          changeDomain={this.changeDomain}
          domains={this.state.domains}
          domainSelected={this.state.domainSelected}
          pages={this.state.pages}
          pageSelected={this.state.pageSelected}
          changePage={this.changePage}
        />
        <div>Data</div>
      </>
    );
  }
}

export default InjectAppServices(Reports);
