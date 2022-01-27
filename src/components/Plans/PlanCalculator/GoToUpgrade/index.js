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

  if (!isTrial) {
    if (planType === PLAN_TYPE.byCredit) {
      // Redirect to buy credits with all query parameters
      return (
        <>
          <Loading />
          <SafeRedirect to={`/ControlPanel/AccountPreferences/BuyCreditsStep1${location.search}`} />
        </>
      );
    } else {
      const queryParams = new URLSearchParams(location.search);
      if (queryParams.has('PromoCode')) {
        // Delete PromoCode query parameter: https://docs.google.com/spreadsheets/d/1CSXmsVqZTwIhzPRH8_tcPohHmvDXffLTQ-veF-53698/edit#gid=0
        queryParams.delete('PromoCode');
      }
      const restQueryParams = queryParams.toString();
      // Redirect to upgrade page with popup (without promocode query parameter)
      return (
        <>
          <Loading />
          <SafeRedirect
            to={`/ControlPanel/AccountPreferences/GetAccountInformation${
              restQueryParams ? `?${restQueryParams}` : ''
            }`}
          />
        </>
      );
    }
  }

  return <PlanCalculator />;
});
