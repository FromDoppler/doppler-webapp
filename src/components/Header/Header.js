import React from 'react';
import HeaderNav from './HeaderNav/HeaderNav';
import HeaderUserMenu from './HeaderUserMenu/HeaderUserMenu';
import headerData from '../../headerData.json';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHeaderOpen: false,
    };
    this.toggleHeaderOpen = this.toggleHeaderOpen.bind(this);
  }

  toggleHeaderOpen(value) {
    this.setState({
      isHeaderOpen: value,
    });
  }

  render() {
    return (
      <header className={this.state.isHeaderOpen ? 'header-main header-open' : 'header-main'}>
        <div className="header-wrapper">
          <div className="logo">
            <span className="ms-icon icon-doppler-logo" />
          </div>
          <HeaderNav toggleHeaderOpen={this.toggleHeaderOpen} nav={headerData.nav} />
          <nav className="nav-right-main">
            <ul>
              <li>
                <a href="http://google.com" className="active" data-count="1">
                  <span className="ms-icon icon-notification" />
                </a>
              </li>
              <li>
                <a href="http://google.com">
                  <span className="ms-icon icon-header-help" />
                </a>
              </li>
              <li>
                <HeaderUserMenu user={headerData.user} />
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;
