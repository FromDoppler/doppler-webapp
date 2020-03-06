import React from 'react';
import HeaderNav from './HeaderNav/HeaderNav';
import HeaderMessages from './HeaderMessages/HeaderMessages';
import HeaderUserMenu from './HeaderUserMenu/HeaderUserMenu';
import { FormattedMessage } from 'react-intl';
import Notifications from './Notifications';

const Header = ({
  userData: { user, nav, alert, notifications, emptyNotificationText },
  location: { pathname },
}) => {
  const inactiveSection =
    pathname.match(/^\/integrations\/*/) !== null ||
    pathname.match(/^\/reports\/subscriber-gdpr*/) !== null;
  return (
    <div>
      {alert ? <HeaderMessages alert={alert} user={user} /> : null}
      {/* //TODO: Refactor backend to send proper active values. Class 'header-is-active' must be removed */}
      <header
        className={
          'header-main' +
          (inactiveSection ? ' ' : ' header-open') +
          (user.clientManager ? ' dp-header--cm' : ' ')
        }
      >
        {user.clientManager ? (
          <div className="dp-logo--cm">
            {user.clientManager.logo ? (
              <img alt={user.clientManager.companyName} src={user.clientManager.logo} />
            ) : (
              <span>{user.clientManager.companyName}</span>
            )}
          </div>
        ) : null}

        <div className="header-wrapper">
          <div className="logo">
            <span className="ms-icon icon-doppler-logo" />
          </div>
          <HeaderNav nav={nav} inactiveSection={inactiveSection} />
          <nav className="nav-right-main">
            <ul className="nav-right-main--list">
              <li>
                <Notifications
                  plan={user.plan}
                  notifications={notifications}
                  emptyNotificationText={emptyNotificationText}
                />
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
                <HeaderUserMenu user={user} />
              </li>
            </ul>
            <span id="open-menu" className="ms-icon icon-menu desktop-hd-hidden" />
            <span id="close-menu" className="ms-icon icon-close desktop-hd-hidden" />
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
