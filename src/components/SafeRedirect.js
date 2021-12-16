import React from 'react';
import { InjectAppServices } from '../services/pure-di';
import RedirectToExternalUrl from './RedirectToExternalUrl';
import { isWhitelisted } from './../utils';
import { Redirect } from 'react-router-dom';

/**
 * @param { Object } props
 * @param { string } props.to
 * @param { import('../services/pure-di').AppServices } props.dependencies
 */
function SafeRedirect({ to, dependencies }) {
  const newDashboard = process.env.NEW_DASHBOARD === 'true';

  const isPartialUrl = (url) => {
    return /^\/[^/]/.test(url);
  };

  if (isPartialUrl(to)) {
    return <RedirectToExternalUrl to={dependencies.appConfiguration.dopplerLegacyUrl + to} />;
  } else if (isWhitelisted(to)) {
    return <RedirectToExternalUrl to={to} />;
  } else if (newDashboard) {
    <Redirect to="/" />;
  } else {
    return (
      <RedirectToExternalUrl
        to={dependencies.appConfiguration.dopplerLegacyUrl + '/Campaigns/Draft'}
      />
    );
  }
}
export default InjectAppServices(SafeRedirect);
