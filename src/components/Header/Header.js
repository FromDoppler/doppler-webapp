import React from 'react';
import HeaderNav from './HeaderNav/HeaderNav';
import HeaderMessages from './HeaderMessages/HeaderMessages';
import HeaderUserMenu from './HeaderUserMenu/HeaderUserMenu';
import { FormattedMessage } from 'react-intl';
import Notifications from './Notifications';
import { getCurrentPageForUrl } from '../../utils';
import { Link } from 'react-router-dom';

const getUpdatedSubNav = (currentSubNav, subMenuItem) => {
  return currentSubNav.map((item) => {
    return {
      title: item.title,
      url: item.url,
      isSelected: item.idHTML === subMenuItem,
    };
  });
};

const getUpdateMenu = (currentUrl, nav) => {
  const currentPage = getCurrentPageForUrl(currentUrl);
  if (currentPage && currentPage.menu) {
    return nav.map((item) => {
      return {
        title: item.title,
        url: item.url,
        isSelected: item.idHTML === currentPage.menu,
        subNav: !currentPage.subMenu
          ? item.subNav
          : getUpdatedSubNav(item.subNav, currentPage.subMenu),
      };
    });
  }
  return nav;
};

const Header = ({
  userData: { user, nav, alert, notifications, emptyNotificationText },
  location: { pathname },
}) => {
  const updatedNav = getUpdateMenu(pathname, nav);
  const currentPage = getCurrentPageForUrl(pathname);
  const isInactiveSection = !currentPage || !currentPage.menu;
  return (
    <div>
      {alert ? <HeaderMessages alert={alert} user={user} /> : null}
      <header
        className={
          'header-main' +
          (alert ? ' sticky' : ' ') +
          (isInactiveSection ? ' ' : ' header-open') +
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
            <Link to={'/dashboard'}>
              <span className="ms-icon icon-doppler-logo" />
            </Link>
          </div>
          <HeaderNav nav={updatedNav} isInactiveSection={isInactiveSection} />
          <nav className="nav-right-main">
            <ul className="nav-right-main--list">
              <li>
                <Notifications
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
