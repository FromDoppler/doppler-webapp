import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

export const BannerUpgrade = ({ currentPlan, currentPlanList }) => {
  const getBannerInfo = (type) => {
    const bannerInfo = { messageId: `plan_calculator.banner_for_${type.replace('-', '_')}` };
    switch (type) {
      case 'prepaid':
      case 'subscribers':
        return {
          ...bannerInfo,
          link: `/plan-selection/${currentPlan.featureSet}/monthly-deliveries`,
        };
      case 'monthly-deliveries':
        // TODO: define where to go in this case
        return { ...bannerInfo, link: `/email-marketing-agencies` };
      default:
        return `plan_calculator.banner_for_unknown`;
    }
  };

  if (currentPlan.id === currentPlanList[currentPlanList.length - 1].id) {
    const bannerInfo = getBannerInfo(currentPlan.type);
    return (
      <div className="dp-calc-message">
        <p>
          <FormattedMessage
            id={bannerInfo.messageId}
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
  }
  return <></>;
};
