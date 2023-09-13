import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../../doppler-types';

export const getUpgradeInfo = (type, planTypes, queryParams) => {
  const bannerInfo = {
    messageId: `plan_calculator.banner_for_${type.replace('-', '_')}`,
    link: `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}${
      queryParams ? `?${queryParams}` : ''
    }`,
  };
  const suggestionInfo = {
    messageId: `plan_calculator.suggestion_for_${type.replace('-', '_')}`,
    link: `/upgrade-suggestion-form`,
  };

  switch (type) {
    case PLAN_TYPE.byCredit:
    case PLAN_TYPE.byContact:
      if (planTypes?.includes(PLAN_TYPE.byEmail)) {
        return { banner: bannerInfo, suggestion: suggestionInfo };
      } else {
        const subscriberMonthlyPlan = {
          ...suggestionInfo,
          messageId: 'plan_calculator.advice_for_subscribers_large_plan',
        };
        return {
          banner: subscriberMonthlyPlan,
          suggestion: subscriberMonthlyPlan,
        };
      }

    case PLAN_TYPE.byEmail:
      return {
        banner: {
          ...bannerInfo,
          link: `/upgrade-suggestion-form`,
        },
        suggestion: {
          ...suggestionInfo,
          link: `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}${
            queryParams ? `?${queryParams}` : ''
          }`,
        },
      };
    default:
      return {
        banner: {
          ...bannerInfo,
          messageId: `plan_calculator.banner_for_unknown`,
        },
        suggestion: {
          ...suggestionInfo,
          messageId: `plan_calculator.suggestion_for_unknown`,
        },
      };
  }
};
