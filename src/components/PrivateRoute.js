import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer/Footer';
import {
  SiteTrackingRequired,
  SiteTrackingNotAvailableReasons,
} from './SiteTrackingRequired/SiteTrackingRequired';
import RedirectToLogin from './RedirectToLogin';
import { Loading } from './Loading/Loading';
import { InjectAppServices } from '../services/pure-di';
import MenuDemo from './MenuDemo/MenuDemo';
import { nonAuthenticatedBlockedUser } from '../doppler-types';

export default InjectAppServices(
  /**
   * @param { Object } props
   * @param { Boolean } props.requireSiteTracking
   * @param { import('../services/pure-di').AppServices } props.dependencies
   */
  ({
    requireSiteTracking,
    children,
    dependencies: {
      appSessionRef: { current: dopplerSession },
    },
  }) => {
    const location = useLocation();

    if (dopplerSession.status === 'authenticated') {
      return (
        <div className="dp-app-container">
          <MenuDemo />
          {/* <Header userData={dopplerSession.userData} location={props.location} /> */}
          {/* TODO: remove all Header related code */}
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
            children
          )}
          <Footer />
        </div>
      );
    }

    if (dopplerSession.status === nonAuthenticatedBlockedUser) {
      return children;
    }

    if (dopplerSession.status === 'unknown') {
      return <Loading page />;
    }

    return <RedirectToLogin from={location} />;
  },
);
