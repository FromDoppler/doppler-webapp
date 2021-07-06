import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

export const BannerUpgrade = ({ sessionPlan, currentPlan, currentPlanList }) => {
  const getUpgradeInfo = (type) => {
    const bannerInfo = { messageId: `plan_calculator.banner_for_${type.replace('-', '_')}` };
    const suggestionInfo = {
      messageId: `plan_calculator.suggestion_for_${type.replace('-', '_')}`,
    };

    switch (type) {
      case 'prepaid':
      case 'subscribers':
        return {
          banner: {
            ...bannerInfo,
            link: `/plan-selection/${currentPlan.featureSet}/monthly-deliveries`,
          },
          suggestion: {
            ...suggestionInfo,
            link: '#',
          },
        };
      case 'monthly-deliveries':
        // TODO: define where to go in this case
        return {
          banner: {
            ...bannerInfo,
            link: `/email-marketing-agencies`,
          },
          suggestion: {
            ...suggestionInfo,
            link: '#',
          },
        };
      default:
        return { ...bannerInfo, messageId: `plan_calculator.banner_for_unknown` };
    }
  };

  const hightestPlan = currentPlanList.length === 1 && currentPlan.id === sessionPlan.idPlan;

  if (currentPlan.id === currentPlanList[currentPlanList.length - 1].id && !hightestPlan) {
    const bannerInfo = getUpgradeInfo(currentPlan.type);
    return (
      <div className="dp-calc-message">
        <p>
          <FormattedMessage
            id={bannerInfo.banner.messageId}
            values={{
              Link: (chunk) => (
                <Link to={bannerInfo.link}>
                  <strong>{chunk}</strong>
                </Link>
              ),
            }}
          />
        </p>
      </div>
    );
  } else if (currentPlan.id === currentPlanList[currentPlanList.length - 1].id && hightestPlan) {
    const suggestionInfo = getUpgradeInfo(currentPlan.type);
    return (
      <div className="dp-message-upgrade-plan m-t-24 m-b-24">
        <p>
          <FormattedMessage
            id={suggestionInfo.suggestion.messageId}
            values={{
              Link: (chunk) => <Link to={suggestionInfo.suggestion.link}>{chunk}</Link>,
              Bold: (chunk) => <strong>{chunk}</strong>,
            }}
          />
        </p>
      </div>
    );
  } else {
    return <></>;
  }
};
