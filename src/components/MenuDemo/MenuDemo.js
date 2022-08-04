import React, { useEffect } from 'react';

// TODO: rename it to Menu
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

  return <div id="doppler-menu-mfe"></div>;
};

export default MenuDemo;
