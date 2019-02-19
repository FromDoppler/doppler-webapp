import React from 'react';
import HeaderNav from './HeaderNav/HeaderNav';
import HeaderUserMenu from './HeaderUserMenu/HeaderUserMenu';
import headerData from '../../headerData.json';
import { ReactComponent as DopplerLogo } from '../../doppler-logo.svg';

class Header extends React.Component {
  render() {
    return (
      <header>
        <DopplerLogo />
        <HeaderNav nav={headerData.nav} />
        <HeaderUserMenu user={headerData.user} />
      </header>
    );
  }
}

export default Header;
