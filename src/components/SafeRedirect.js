import React from 'react';
import { InjectAppServices } from '../services/pure-di';
import RedirectToExternalUrl from './RedirectToExternalUrl';
import { isWhitelisted } from './../utils';
import { getDefaultView } from '../App';

/**
 * @param { Object } props
 * @param { string } props.to
 * @param { import('../services/pure-di').AppServices } props.dependencies
 */
function SafeRedirect({ to, dependencies }) {
  const isPartialUrl = (url) => {
    return /^\/[^/]/.test(url);
  };

  if (isPartialUrl(to)) {
    return <RedirectToExternalUrl to={dependencies.appConfiguration.dopplerLegacyUrl + to} />;
  } else if (isWhitelisted(to)) {
    return <RedirectToExternalUrl to={to} />;
  } else {
    return (
      <RedirectToExternalUrl
        to={dependencies.appConfiguration.dopplerLegacyUrl + getDefaultView()}
      />
    );
  }
}
export default InjectAppServices(SafeRedirect);
