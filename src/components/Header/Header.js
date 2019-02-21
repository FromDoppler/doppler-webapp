import React from 'react';
import HeaderNav from './HeaderNav/HeaderNav';
import HeaderUserMenu from './HeaderUserMenu/HeaderUserMenu';
import headerData from '../../headerData.json';

const Header = (props) => {
  return (
    <header className="header-main">
      <div className="header-wrapper">
        <div className="logo">
          <span className="ms-icon icon-doppler-logo" />
        </div>
        <HeaderNav nav={headerData.nav} />
        <nav className="nav-right-main">
          <ul>
            <li>
              <a href="https://www.fromdoppler.com/" className="active" data-count="1">
                <span className="ms-icon icon-notification" />
              </a>
            </li>
            <li>
              <a href="https://help.fromdoppler.com/es/">
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
};

export default Header;
