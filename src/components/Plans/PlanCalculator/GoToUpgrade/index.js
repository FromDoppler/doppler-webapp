import React from 'react';
import { useLocation } from 'react-router-dom';
import { PlanCalculator } from '..';
import { PLAN_TYPE } from '../../../../doppler-types';
import { InjectAppServices } from '../../../../services/pure-di';
import { Loading } from '../../../Loading/Loading';
import SafeRedirect from '../../../SafeRedirect';

export const GoToUpgrade = InjectAppServices(({ dependencies: { appSessionRef } }) => {
  const { isFreeAccount: isTrial, planType } = appSessionRef.current.userData.user.plan;
  const location = useLocation();

  if (!isTrial && planType === PLAN_TYPE.byCredit) {
    // Redirect to buy credits with all query parameters
    return (
      <>
        <Loading />
        <SafeRedirect to={`/ControlPanel/AccountPreferences/BuyCreditsStep1${location.search}`} />
      </>
    );
  }

  return <PlanCalculator />;
});
