import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

export const BannerUpgrade = ({ currentPlan, messageId }) => {
  const hightestPlan = currentPlan === undefined || currentPlan.active === false;

  if (hightestPlan) {
    const upgradeInfo = {
      messageId: messageId,
      link: `/upgrade-suggestion-form`,
    };

    return (
      <div className="dp-calc-message" data-testid="dp-calc-message">
        <p>
          <FormattedMessage
            id={upgradeInfo.messageId}
            values={{
              Link: (chunk) => <Link to={upgradeInfo.link}>{chunk}</Link>,
            }}
          />
        </p>
      </div>
    );
  }

  return null;
};
