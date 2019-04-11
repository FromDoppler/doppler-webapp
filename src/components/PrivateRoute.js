import React from 'react';
import { Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { InjectAppServices } from '../services/pure-di';
import DatahubRequired from './DatahubRequired/DatahubRequired';

/**
 * @param { Object } props
 * @param { React.Component } props.component
 * @param { Boolean } props.requireDatahub
 * @param { import('../services/app-session').AppSession } props.dopplerSession
 * @param { import('../services/pure-di').AppServices } props.dependencies
 */
function PrivateRoute({
  component: Component,
  requireDatahub,
  dopplerSession,
  dependencies: { RedirectToLogin },
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) =>
        dopplerSession.status === 'authenticated' ? (
          <>
            <Header userData={dopplerSession.userData} />
            {!requireDatahub || dopplerSession.datahubCustomerId ? (
              <Component {...props} />
            ) : (
              <DatahubRequired />
            )}
            <Footer />
          </>
        ) : (
          <RedirectToLogin from={props.location} />
        )
      }
    />
  );
}

export default InjectAppServices(PrivateRoute);
