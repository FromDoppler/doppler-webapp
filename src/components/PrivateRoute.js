import React from 'react';
import { Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import DatahubRequired from './DatahubRequired/DatahubRequired';
import RedirectToLogin from './RedirectToLogin';
import Loading from './Loading/Loading';
import { InjectAppServices } from '../services/pure-di';

export default InjectAppServices(
  /**
   * @param { Object } props
   * @param { React.Component } props.component
   * @param { Boolean } props.requireDatahub
   * @param { import('../services/pure-di').AppServices } props.dependencies
   */
  ({
    component: Component,
    requireDatahub,
    dependencies: {
      appSessionRef: { current: dopplerSession },
    },
    ...rest
  }) => (
    <Route
      {...rest}
      render={(props) =>
        dopplerSession.status === 'unknown' ? (
          <Loading page />
        ) : dopplerSession.status === 'authenticated' ? (
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
  ),
);
