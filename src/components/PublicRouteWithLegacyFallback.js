import React from 'react';
import { Route } from 'react-router-dom';
import { InjectAppServices } from '../services/pure-di';
import { injectIntl } from 'react-intl';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import ForgotPassword from './ForgotPassword/ForgotPassword';

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
  '/forgot-password': {
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
  const from =
    routeComponentProps.location &&
    routeComponentProps.location.state &&
    routeComponentProps.location.state.from;
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
  path,
  intl,
  dependencies: {
    appConfiguration: { dopplerLegacyUrl, useLegacy },
    window: { location },
  },
  ...rest
}) {
  const page = pagesByPath[path];
  if (!page) {
    throw new Error(`${path} is an invalid path for PublicRouteWithLegacyFallback`);
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!useLegacy || !useLegacy[page.name]) {
          const Component = page.webAppComponent;
          return <Component {...props} />;
        }

        const redirectionData = page.legacyRedirectDataResolver(props, location);

        const parametersString = redirectionData.parameters.filter((x) => !!x).join('&');
        const destinationUrl =
          `${dopplerLegacyUrl}${redirectionData.page}` +
          (parametersString && '?' + parametersString);

        location.href = destinationUrl;

        return <></>;
      }}
    />
  );
}

export default InjectAppServices(injectIntl(PublicRouteWithLegacyFallback));
