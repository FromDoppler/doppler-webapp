import React from 'react';
import { Redirect } from 'react-router-dom';

interface ReactRouterLocation {
  pathname: string;
  search: string;
  hash: string;
}

export type RedirectToLogin = ({ from }: { from: ReactRouterLocation }) => JSX.Element;

export function RedirectToInternalLogin({ from }: { from: ReactRouterLocation }) {
  return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: from },
      }}
    />
  );
}

export function RedirectToLegacyLoginFactory(dopplerLegacyUrl: string, { location }: Window) {
  return ({ from }: { from: ReactRouterLocation }) => {
    const basePath = `${location.protocol}//${location.host}${location.pathname}`;
    const appPath = `${from.pathname}${from.search}${from.hash}`;
    const currentUrlEncoded = encodeURI(`${basePath}#${appPath}`);
    const loginUrl = `${dopplerLegacyUrl}/SignIn/index?redirect=${currentUrlEncoded}`;
    location.href = loginUrl;
    return <></>;
  };
}
