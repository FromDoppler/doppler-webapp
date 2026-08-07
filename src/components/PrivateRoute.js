import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
import { isCollaboratorPermissionsEnabled } from '../services/feature-collaborator-permissions-flag';

const COLLABORATOR_PROFILE_TYPE = 'COLLABORATOR';

const isCollaborator = (dopplerSession) =>
  dopplerSession?.userData?.userAccount?.userProfileType === COLLABORATOR_PROFILE_TYPE;

const hasAccessToSection = (dopplerSession, sectionId) => {
  if (!sectionId || !isCollaborator(dopplerSession)) {
    return true;
  }

  const collaboratorViewAccessRights =
    dopplerSession.userData.userAccount?.collaboratorViewAccessRights || [];

  return collaboratorViewAccessRights.some(
    ({ idSection }) => Number(idSection) === Number(sectionId),
  );
};

const getNoAccessRedirectUrl = () => '/login';

export default InjectAppServices(
  /**
   * @param { Object } props
   * @param { Boolean } props.requireSiteTracking
   * @param { Number } props.sectionId
   * @param { import('../services/pure-di').AppServices } props.dependencies
   */
  ({
    requireSiteTracking,
    sectionId,
    children,
    dependencies: {
      appSessionRef: { current: dopplerSession },
    },
  }) => {
    const location = useLocation();

    if (dopplerSession.status === 'authenticated') {
      if (
        isCollaboratorPermissionsEnabled() &&
        !hasAccessToSection(dopplerSession, sectionId)
      ) {
        return <Navigate to={getNoAccessRedirectUrl()} replace />;
      }

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
