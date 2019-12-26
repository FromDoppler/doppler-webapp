import React from 'react';
import { InjectAppServices } from '../services/pure-di';
import RedirectToExternalUrl from './RedirectToExternalUrl';

/**
 * @param { Object } props
 * @param { string } props.to
 * @param { import('../services/pure-di').AppServices } props.dependencies
 */
function SafeRedirect({ to, dependencies }) {
  const isPartialUrl = (url) => {
    return /^\/[^/]/.test(url);
  };

  const isWhitelisted = (url) => {
    const loginWhitelist = [
      'https://academy.fromdoppler.com/',
      'http://academy.fromdoppler.com/',
      'http://prod.doppleracademy.com/',
      'https://prod.doppleracademy.com/',
      'https://doppleracademy.com/',
      'http://doppleracademy.com/',
    ];
    return loginWhitelist.some((element) => url.startsWith(element));
  };

  if (isPartialUrl(to)) {
    return <RedirectToExternalUrl to={dependencies.appConfiguration.dopplerLegacyUrl + to} />;
  } else if (isWhitelisted(to)) {
    return <RedirectToExternalUrl to={to} />;
  } else {
    return (
      <RedirectToExternalUrl
        to={dependencies.appConfiguration.dopplerLegacyUrl + '/Campaigns/Draft'}
      />
    );
  }
}
export default InjectAppServices(SafeRedirect);
