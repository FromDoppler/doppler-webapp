import React from 'react';
import HeaderNav from './HeaderNav/HeaderNav';
import HeaderMessages from './HeaderMessages/HeaderMessages';
import HeaderUserMenu from './HeaderUserMenu/HeaderUserMenu';
import { FormattedMessage } from 'react-intl';

const Header = ({ userData }) => {
  return (
    <div>
      {userData.alert ? <HeaderMessages alert={userData.alert} /> : null}
      <header className="header-main">
        <div className="header-wrapper">
          <div className="logo">
            <span className="ms-icon icon-doppler-logo" />
          </div>
          <HeaderNav nav={userData.nav} />
          <nav className="nav-right-main">
            <ul>
              <li>
                <span className="active" data-count="1">
                  <span className="ms-icon icon-notification" />
                </span>
              </li>
              <li>
                <FormattedMessage id="header.help_url">
                  {(url) => (
                    <a href={url}>
                      <span className="ms-icon icon-header-help" />
                    </a>
                  )}
                </FormattedMessage>
              </li>
              <li>
                <HeaderUserMenu user={userData.user} />
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
