import React from 'react';
import { InjectAppServices } from '../services/pure-di';
import RedirectToExternalUrl from './RedirectToExternalUrl';

/**
 * @param { Object } props
 * @param { string } props.to
 * @param { import('../services/pure-di').AppServices } props.dependencies
 */
function SafeRedirect({ to, dependencies }) {
  return <RedirectToExternalUrl to={dependencies.appConfiguration.dopplerLegacyUrl + to} />;
}
export default InjectAppServices(SafeRedirect);
