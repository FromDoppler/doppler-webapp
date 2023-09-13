import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { getUpgradeInfo } from './getUpgradeInfo';
import { InjectAppServices } from '../../../../services/pure-di';

export const BannerUpgrade = InjectAppServices(
  ({ currentPlan, currentPlanList, planTypes, queryParams, dependencies: { appSessionRef } }) => {
    const sessionPlan = appSessionRef.current.userData.user;
    const hightestPlan = currentPlanList.length === 1 && currentPlan?.id === sessionPlan.idPlan;
    const currentPlanSelected = currentPlan?.id === currentPlanList[currentPlanList.length - 1]?.id;

    if (currentPlanSelected && currentPlan) {
      const upgradeInfo = getUpgradeInfo(currentPlan?.type, planTypes, queryParams);

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
    } else {
      return <></>;
    }
  },
);
