import PropTypes from 'prop-types';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';

export const SubscriptionType = ({ period, discountPercentage }) => {
  return (
    <section className="dp-align--center p-t-30">
      <div className="dp-wrap-message dp-wrap-info">
        <span class="dp-message-icon" />
        <div class="dp-content-message">
          <div className="p-b-6">
            <FormattedMessageMarkdown
              id="plan_calculator.current_subscription"
              values={{ period }}
            />
          </div>
          <FormattedMessageMarkdown
            id="plan_calculator.subscription_discount"
            values={{ discountPercentage }}
          />
        </div>
      </div>
    </section>
  );
};

SubscriptionType.propTypes = {
  period: PropTypes.oneOf([1, 3, 6, 12]),
  discountPercentage: PropTypes.number,
};
