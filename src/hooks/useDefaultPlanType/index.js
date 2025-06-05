import { useEffect } from 'react';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../doppler-types';
import { getQueryParamsWithAccountType } from '../../utils';
import { useNavigate } from 'react-router-dom';

export const useDefaultPlanType = ({ appSessionRef, planTypeUrlSegment, window }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlToRedirect = getDefaultPlanType({
      currentPlan: appSessionRef.current.userData.user.plan,
      planTypeUrlSegment,
      window,
    });
    if (urlToRedirect) {
      navigate(urlToRedirect);
    }
  }, [appSessionRef, planTypeUrlSegment, navigate, window]);

  return null;
};

export const getDefaultPlanType = ({ currentPlan, planTypeUrlSegment, window }) => {
  const { isFreeAccount: isTrial, planType } = currentPlan;
  const queryParams = getQueryParamsWithAccountType({
    search: window.location.search,
    isFreeAccount: isTrial,
  });
  if (!isTrial) {
    switch (planType) {
      case PLAN_TYPE.byEmail:
        if (planTypeUrlSegment !== URL_PLAN_TYPE[PLAN_TYPE.byEmail]) {
          return `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}${
            queryParams ? `?${queryParams}` : ''
          }`;
        }
        break;
      case PLAN_TYPE.byContact:
        if (planTypeUrlSegment !== URL_PLAN_TYPE[PLAN_TYPE.byContact]) {
          return `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}${
            queryParams ? `?${queryParams}` : ''
          }`;
        }
        break;
      case PLAN_TYPE.byCredit:
        if (!Object.values(URL_PLAN_TYPE).includes(planTypeUrlSegment)) {
          return `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byCredit]}${
            queryParams ? `?${queryParams}` : ''
          }`;
        }
        break;
      default:
        // TODO: define scenary
        break;
    }
  }
  return null;
};
