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

  const price = 5;

  return (
    <>
      <div className="col-sm-6">
        <div>
          <span className="dp-legend-price">
            {_(`my_plan.addons.landing_pages.packs_from_legend`)}
          </span>
          <h2>
            US$ <FormattedNumber value={price} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">{_(`my_plan.addons.landing_pages.month_legend`)}</span>
        </div>
      </div>
    </>
  );
};

export const LandingPages = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.landing_pages.title`)}
      icon={'iconapp-landing-page'}
      description={_(`my_plan.addons.landing_pages.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={'#'}
      buyButtonText={_(`my_plan.addons.buy_button`)}
      buyButtonUrl={'/landing-packages?buyType=3'}
    ></Card>
  );
};
