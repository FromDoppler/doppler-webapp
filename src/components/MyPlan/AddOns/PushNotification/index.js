import { FormattedNumber, useIntl } from 'react-intl';
import { Card } from '../Card';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const PriceSection = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const price = 15;

  return (
    <>
      <div className="col-sm-6">
        <div>
          <span className="dp-legend-price">
            {_(`my_plan.addons.push_notification.plans_from_legend`)}
          </span>
          <h2>
            US$ <FormattedNumber value={price} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">
            {_(`my_plan.addons.push_notification.month_legend`)}
          </span>
        </div>
      </div>
    </>
  );
};

export const PushNotification = ({ pushNotification }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  var hasPushNotification = pushNotification.plan?.active;

  return (
    <Card
      title={_(`my_plan.addons.push_notification.title`)}
      icon={'dpicon iconapp-bell1'}
      description={_(`my_plan.addons.push_notification.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={_(`my_plan.addons.push_notification.more_information_link`)}
      buyButtonText={_(
        `${
          hasPushNotification
            ? 'my_plan.addons.change_plan_button'
            : pushNotification.active
              ? 'my_plan.addons.buy_button'
              : 'my_plan.addons.activate_now_button'
        }`,
      )}
      buyButtonUrl={pushNotification.plan.buttonUrl}
    ></Card>
  );
};
