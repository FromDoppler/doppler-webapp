import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Card } from '../Card';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
};

const PriceSection = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const price = 0.008;

  return (
    <>
      <div className="col-sm-6">
        <div>
          <span className="dp-legend-price">
            <FormattedMessage
              id={`my_plan.addons.list_conditioning.from_contact_legend`}
              values={{
                contacts: 2499,
              }}
            />
          </span>
          <h2>
            US$ <FormattedNumber value={price} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">
            {_(`my_plan.addons.list_conditioning.price_legend`)}
          </span>
        </div>
      </div>
    </>
  );
};

export const ListConditioning = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.list_conditioning.title`)}
      icon={'iconapp-checklist'}
      description={_(`my_plan.addons.list_conditioning.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={'#'}
      buyButtonText={_(`my_plan.addons.request_quote_button`)}
      buyButtonUrl={'/additional-services?selected-feature=features7'}
    ></Card>
  );
};
