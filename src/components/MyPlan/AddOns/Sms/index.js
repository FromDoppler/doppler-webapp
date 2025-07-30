import { FormattedNumber, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../services/pure-di';
import { ACCOUNT_TYPE, FREE_ACCOUNT } from '../../../../utils';
import { Card } from '../Card';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const PriceSection = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const loadFrom = 50;

  return (
    <>
      <div className="col-sm-6">
        <div>
          <span className="dp-legend-price">{_(`my_plan.addons.sms.load_from_legend`)}</span>
          <h2>
            US$ <FormattedNumber value={loadFrom} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">{_(`my_plan.addons.sms.minimum_load_legend`)}</span>
        </div>
      </div>
    </>
  );
};

export const Sms = InjectAppServices(({ sms, isFreeAccount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  var buyUrl = isFreeAccount ? `/plan-types?${ACCOUNT_TYPE}=${FREE_ACCOUNT}` : sms.buttonUrl;
  return (
    <Card
      title={_(`my_plan.addons.sms.title`)}
      icon={'iconapp-checklist'}
      description={_(`my_plan.addons.sms.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={_(`my_plan.addons.sms.more_information_link`)}
      buyButtonText={_(`my_plan.addons.buy_button`)}
      buyButtonUrl={buyUrl}
    ></Card>
  );
});
