import React from 'react';
import { Route } from 'react-router-dom';
import { InjectAppServices } from '../services/pure-di';
import { injectIntl } from 'react-intl';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import RedirectToExternalUrl from './RedirectToExternalUrl';

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
        const forceWebapp = /[?&]force-webapp(&.*)?$/.test(props.location.search);
        const forceLegacy = /[?&]force-legacy(&.*)?$/.test(props.location.search);

        if (forceWebapp || (!forceLegacy && (!useLegacy || !useLegacy[page.name]))) {
          const Component = page.webAppComponent;
          return <Component {...props} />;
        }

        const redirectionData = page.legacyRedirectDataResolver(props, location);

        // TODO: improve this parsing code and logic
        // TODO: consider send language, lang and id parameters based on current locale
        if (
          props.location.search &&
          props.location.search.length &&
          props.location.search[0] === '?'
        ) {
          const currentParameters = props.location.search.substring(1);
          redirectionData.parameters.push(currentParameters);
        }

        const parametersString = redirectionData.parameters.filter((x) => !!x).join('&');
        const destinationUrl =
          `${dopplerLegacyUrl}${redirectionData.page}` +
          (parametersString && '?' + parametersString);

        return <RedirectToExternalUrl to={destinationUrl} />;
      }}
    />
  );
}

export default InjectAppServices(injectIntl(PublicRouteWithLegacyFallback));
