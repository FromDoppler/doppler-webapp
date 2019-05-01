import React from 'react';
import { Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import {
  SiteTrackingRequired,
  SiteTrackingNotAvailableReasons,
} from './SiteTrackingRequired/SiteTrackingRequired';
import RedirectToLogin from './RedirectToLogin';
import Loading from './Loading/Loading';
import { InjectAppServices } from '../services/pure-di';

export default InjectAppServices(
  /**
   * @param { Object } props
   * @param { React.Component } props.component
   * @param { Boolean } props.requireSiteTracking
   * @param { import('../services/pure-di').AppServices } props.dependencies
   */
  ({
    component: Component,
    requireSiteTracking,
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
            {requireSiteTracking &&
            !dopplerSession.userData.features.siteTrackingEnabled &&
            !dopplerSession.userData.user.plan.isFreeAccount ? (
              <SiteTrackingRequired reason={SiteTrackingNotAvailableReasons.trialNotAccepted} />
            ) : requireSiteTracking &&
              !dopplerSession.userData.features.siteTrackingEnabled &&
              dopplerSession.userData.user.plan.isFreeAccount ? (
              <SiteTrackingRequired reason={SiteTrackingNotAvailableReasons.freeAccount} />
            ) : requireSiteTracking && !dopplerSession.userData.datahubCustomerId ? (
              <SiteTrackingRequired reason={SiteTrackingNotAvailableReasons.noDatahubId} />
            ) : requireSiteTracking && !dopplerSession.userData.features.siteTrackingActive ? (
              <SiteTrackingRequired reason={SiteTrackingNotAvailableReasons.featureDisabled} />
            ) : (
              <Component {...props} />
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
