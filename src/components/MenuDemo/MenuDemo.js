import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const MenuDemo = () => {
  useEffect(() => {
    window['doppler-menu-mfe-configuration'] = {
      dopplerMenuElementId: 'doppler-menu-mfe',
      useDummies: false,
    };
    window.assetServices &&
      window.assetServices.load({
        manifestURL: process.env.REACT_APP_MENU_MFE_MANIFEST_FILE,
      });
  }, []);
  return (
    <div>
      <Link to={'/editors-demo/campaigns/123'}>ir a Editors Demo</Link>
      <div id="doppler-menu-mfe"></div>
    </div>
  );
};

export default MenuDemo;
