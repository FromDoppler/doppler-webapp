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
          <span className="dp-legend-price">{_(`my_plan.addons.onsite.plans_from_legend`)}</span>
          <h2>
            US$ <FormattedNumber value={price} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">{_(`my_plan.addons.onsite.month_legend`)}</span>
        </div>
      </div>
    </>
  );
};

export const OnSite = ({ onSite }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.onsite.title`)}
      icon={'iconapp-online-clothing'}
      description={_(`my_plan.addons.onsite.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={_(`my_plan.addons.onsite.more_information_link`)}
      buyButtonText={_(
        `${onSite.active ? 'my_plan.addons.buy_button' : 'my_plan.addons.activate_now_button'}`,
      )}
      buyButtonUrl={onSite.plan.buttonUrl}
    ></Card>
  );
};
