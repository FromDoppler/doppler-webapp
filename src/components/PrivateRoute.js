import React from 'react';
import { Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import DatahubRequired from './DatahubRequired/DatahubRequired';
import RedirectToLogin from './RedirectToLogin';

/**
 * @param { Object } props
 * @param { React.Component } props.component
 * @param { Boolean } props.requireDatahub
 * @param { import('../services/app-session').AppSession } props.dopplerSession
 */
function PrivateRoute({ component: Component, requireDatahub, dopplerSession, ...rest }) {
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

export default PrivateRoute;
