import PropTypes from 'prop-types';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';

export const SubscriptionType = ({ period, discountPercentage }) => {
  return (
    <div className="dp-align--center p-t-30">
      <div className="p-b-6">
        <FormattedMessageMarkdown id="plan_calculator.current_subscription" values={{ period }} />
      </div>
      <FormattedMessageMarkdown
        id="plan_calculator.subscription_discount"
        values={{ discountPercentage }}
      />
    </div>
  );
};

SubscriptionType.propTypes = {
  period: PropTypes.oneOf([1, 3, 6, 12]),
  discountPercentage: PropTypes.number,
};
