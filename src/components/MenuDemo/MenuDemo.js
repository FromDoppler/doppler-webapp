import React, { useLayoutEffect } from 'react';
import { InjectAppServices } from '../../services/pure-di';

/**
 * @param { Object } props
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
// TODO: rename it to Menu
const MenuDemo = ({
  dependencies: {
    appConfiguration: { dopplerLegacyUrl: dopplerLegacyBaseUrl },
  },
}) => {
  useLayoutEffect(() => {
    // Ugly patch: it is required to load menu early
    // and do not render the page until it is shown
    if (!window['doppler-menu-mfe-configuration']) {
      document.getElementById('root')?.classList.remove('dp-show-page');
    }
    window['doppler-menu-mfe-configuration'] = {
      dopplerMenuElementId: 'doppler-menu-mfe',
      useDummies: false,
      dopplerLegacyBaseUrl,
      onStatusUpdate: (status) => {
        if (status === 'authenticated') {
          document.getElementById('root')?.classList.add('dp-show-page');
        }
      },
      beamerId: process.env.REACT_APP_BEAMER_ID,
      userpilotToken: process.env.REACT_APP_USERPILOT_TOKEN,
    };
    window.assetServices &&
      window.assetServices.load({
        manifestURL: process.env.REACT_APP_MENU_MFE_MANIFEST_FILE,
      });
  }, [dopplerLegacyBaseUrl]);

  return <div id="doppler-menu-mfe"></div>;
};

export default InjectAppServices(MenuDemo);
