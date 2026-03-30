import { FormattedNumber, useIntl } from 'react-intl';
import { Card } from '../Card';
import { InjectAppServices } from '../../../../services/pure-di';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const PriceSection = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const price = 10;

  return (
    <>
      <div className="col-sm-6">
        <div>
          <span className="dp-legend-price">
            {_(`my_plan.addons.artificial_intelligence_agent.access_by_legend`)}
          </span>
          <h2>
            US$ <FormattedNumber value={price} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">
            {_(`my_plan.addons.artificial_intelligence_agent.month_legend`)}
          </span>
        </div>
      </div>
    </>
  );
};

export const EcoAI = InjectAppServices(() => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.artificial_intelligence_agent.title`)}
      icon={'iconapp-dataserver'}
      description={_(`my_plan.addons.artificial_intelligence_agent.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={_(`my_plan.addons.artificial_intelligence_agent.more_information_link`)}
      buyButtonText={_(`my_plan.addons.buy_button`)}
      buyButtonUrl={'/buy-ecoia-plan?buyType=6'}
    ></Card>
  );
});
