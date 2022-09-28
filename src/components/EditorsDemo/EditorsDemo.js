import React, { useEffect } from 'react';

const EditorsDemo = () => {
  useEffect(() => {
    window['doppler-session-mfe-configuration'] = {
      useDummies: true,
    };
    new window.AssetServices().load(process.env.REACT_APP_SESSION_MFE_MANIFEST_FILE);
    window['editors-webapp-configuration'] = {
      basename: 'editors-demo',
      appElementId: 'doppler-editors-webapp',
      useDummies: true,
    };
    new window.AssetServices().load(process.env.REACT_APP_EDITORS_MFE_MANIFEST_FILE);
  }, []);
  return (
    <div>
      <div id="root-header"></div>
      <div id="doppler-editors-webapp"></div>
      <div id="root-footer"></div>
    </div>
  );
};

export default EditorsDemo;
