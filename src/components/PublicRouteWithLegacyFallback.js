import React from 'react';
import { useLocation } from 'react-router-dom';
import { InjectAppServices } from '../services/pure-di';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import RedirectToExternalUrl from './RedirectToExternalUrl';
import { Helmet } from 'react-helmet';

const pagesByPath = {
  '/login': {
    name: 'login',
    webAppComponent: Login,
    legacyRedirectDataResolver: loginRedirectionDataResolver,
  },
  '/signup': {
    name: 'signup',
    webAppComponent: Signup,
    legacyRedirectDataResolver: signupRedirectionDataResolver,
  },
  '/login/reset-password': {
    name: 'forgotPassword',
    webAppComponent: ForgotPassword,
    legacyRedirectDataResolver: forgotPasswordRedirectionDataResolver,
  },
};

function loginRedirectionDataResolver(routeComponentProps, location) {
  const result = {
    page: '/SignIn/',
    parameters: [],
  };
  const from = routeComponentProps.state?.from;
  if (from) {
    const basePath = `${location.protocol}//${location.host}${location.pathname}`;
    const appPath = `${from.pathname}${from.search}${from.hash}`;
    const currentUrlEncoded = encodeURI(`${basePath}#${appPath}`);
    result.parameters.push(`redirect=${currentUrlEncoded}`);
  }
  return result;
}

function signupRedirectionDataResolver() {
  return {
    page: '/Registration/Register/StartRegistration/',
    parameters: [],
  };
}

function forgotPasswordRedirectionDataResolver() {
  return {
    page: '/SignIn/',
    parameters: ['forgotPassword=true'],
  };
}

/**
 * @param { Object } props
 * @param { string } props.path
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('./services/pure-di').AppServices } props.dependencies
 * @param { import('../services/app-session').AppSession } props.dopplerSession
 */
function PublicRouteWithLegacyFallback({
  dependencies: {
    appConfiguration: { dopplerLegacyUrl, useLegacy },
    window: { location },
  },
}) {
  const routeComponentProps = useLocation();
  const page = pagesByPath[routeComponentProps.pathname];
  if (!page) {
    throw new Error(
      `${routeComponentProps.pathname} is an invalid path for PublicRouteWithLegacyFallback`,
    );
  }

  const forceWebapp = /[?&]force-webapp(&.*)?$/.test(routeComponentProps.search);
  const forceLegacy = /[?&]force-legacy(&.*)?$/.test(routeComponentProps.search);
  if (forceWebapp || (!forceLegacy && (!useLegacy || !useLegacy[page.name]))) {
    const Component = page.webAppComponent;
    return (
      <>
        <Helmet>
          <body className="showZohoTitleDiv" />
        </Helmet>
        <Component location={routeComponentProps} />
      </>
    );
  }

  const redirectionData = page.legacyRedirectDataResolver(routeComponentProps, location);

  // TODO: improve this parsing code and logic
  // TODO: consider send language, lang and id parameters based on current locale
  if (routeComponentProps.search?.[0] === '?') {
    const currentParameters = routeComponentProps.search.substring(1);
    redirectionData.parameters.push(currentParameters);
  }

  const parametersString = redirectionData.parameters.filter((x) => !!x).join('&');
  const destinationUrl =
    `${dopplerLegacyUrl}${redirectionData.page}` + (parametersString && '?' + parametersString);

  return <RedirectToExternalUrl to={destinationUrl} />;
}

export default InjectAppServices(PublicRouteWithLegacyFallback);
