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
import { isCollaboratorPermissionsEnabled } from '../services/collaborator-permissions-flag';

export default InjectAppServices(
  /**
   * @param { Object } props
   * @param { Boolean } props.requireSiteTracking
   * @param { Number } props.section
   * @param { import('../services/pure-di').AppServices } props.dependencies
   */
  ({
    requireSiteTracking,
    section,
    children,
    dependencies: {
      appSessionRef: { current: dopplerSession },
      sessionManager,
    },
  }) => {
    const location = useLocation();

    if (dopplerSession.status === 'authenticated') {
      if (isCollaboratorPermissionsEnabled() && section) {
        const canAccessSection = sessionManager.ensureCollaboratorHasAccessOrRedirect(section);

        if (!canAccessSection) {
          return null;
        }
      }

      return (
        <div className="dp-app-container">
          <MenuDemo />
          {/* <Header userData={dopplerSession.userData} location={props.location} /> */}
          {/* TODO: remove all Header related code */}
          <div className="private-route-content">
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
            ) : (
              children
            )}
            <Footer />
          </div>
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
