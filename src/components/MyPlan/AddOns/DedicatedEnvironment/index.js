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

  const price = 150;

  return (
    <>
      <div className="col-sm-6">
        <div className="m-l-18">
          <span className="dp-legend-price">
            {_(`my_plan.addons.dedicated_environment.access_by_legend`)}
          </span>
          <h2>
            US$ <FormattedNumber value={price} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">
            {_(`my_plan.addons.dedicated_environment.month_legend`)}
          </span>
        </div>
      </div>
    </>
  );
};

export const DedicatedEnvironment = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.dedicated_environment.title`)}
      icon={'iconapp-checklist'}
      description={_(`my_plan.addons.dedicated_environment.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={'#'}
      buyButtonText={_(`my_plan.addons.request_quote_button`)}
      buyButtonUrl={'/additional-services?selected-feature=features8'}
    ></Card>
  );
};
