import React, { useEffect } from 'react';

// TODO: rename it to Menu
const MenuDemo = () => {
  // Ugly patch: it is required because in some pages we do not have the menu
  // and we should show them without waiting.
  document.getElementById('root')?.classList.remove('dp-show-page');
  useEffect(() => {
    window['doppler-menu-mfe-configuration'] = {
      dopplerMenuElementId: 'doppler-menu-mfe',
      useDummies: false,
      onStatusUpdate: (status) => {
        if (status === 'authenticated') {
          document.getElementById('root')?.classList.add('dp-show-page');
        }
      },
    };
    window.assetServices &&
      window.assetServices.load({
        manifestURL: process.env.REACT_APP_MENU_MFE_MANIFEST_FILE,
      });
  }, []);

  return <div id="doppler-menu-mfe"></div>;
};

export default MenuDemo;
