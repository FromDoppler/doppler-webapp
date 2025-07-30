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

  const price = 10;

  return (
    <>
      <div className="col-sm-6">
        <div>
          <span className="dp-legend-price">
            {_(`my_plan.addons.collaborators.access_by_legend`)}
          </span>
          <h2>
            US$ <FormattedNumber value={price} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">
            {_(`my_plan.addons.collaborators.collaborator_legend`)}
          </span>
        </div>
      </div>
    </>
  );
};

export const Collaborators = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.collaborators.title`)}
      icon={'iconapp-add-friend'}
      description={_(`my_plan.addons.collaborators.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={''}
      moreInformationLink={''}
      buyButtonText={_(`my_plan.addons.contact_advisor_button`)}
      buyButtonUrl={'/additional-services?selected-feature=features12'}
    ></Card>
  );
};
