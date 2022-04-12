import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const MenuDemo = () => {
  useEffect(() => {
    window['doppler-menu-mfe-configuration'] = {
      dopplerMenuElementId: 'doppler-menu-mfe',
      dmmUseDummies: true,
    };
    new window.AssetServices().load(process.env.REACT_APP_MENU_MFE_MANIFIEST_FILE);
  }, []);
  return (
    <div>
      <Link to={'/editors-demo/campaigns/123'}>ir a Editors Demo</Link>
      <div id="doppler-menu-mfe"></div>
    </div>
  );
};

export default MenuDemo;
