import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../../doppler-types';

export const BannerUpgrade = ({ currentPlan, currentPlanList, planTypes, hightestPlan }) => {
  const currentPlanSelected = currentPlan?.id === currentPlanList[currentPlanList.length - 1]?.id;

  if (currentPlanSelected && currentPlan) {
    const upgradeInfo = getUpgradeInfo(currentPlan?.type, planTypes);

    if (hightestPlan) {
      return (
        <div
          className="dp-message-upgrade-plan m-t-24 m-b-24"
          data-testid="dp-message-upgrade-plan"
        >
          <p>
            <FormattedMessage
              id={upgradeInfo.suggestion.messageId}
              values={{
                Link: (chunk) => <Link to={upgradeInfo.suggestion.link}>{chunk}</Link>,
                Bold: (chunk) => <strong>{chunk}</strong>,
              }}
            />
          </p>
        </div>
      );
    }

    return (
      <div className="dp-calc-message" data-testid="dp-calc-message">
        <p>
          <FormattedMessage
            id={upgradeInfo.banner.messageId}
            values={{
              Link: (chunk) => <Link to={upgradeInfo.banner.link}>{chunk}</Link>,
            }}
          />
        </p>
      </div>
    );
  }

  return null;
};

export const getUpgradeInfo = (type, planTypes) => {
  const bannerInfo = {
    messageId: `plan_calculator.banner_for_${type.replace('-', '_')}`,
    link: `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}${window.location.search}`,
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
          link: `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}`,
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
