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

  const price = 30;

  return (
    <>
      <div className="col-sm-6">
        <div className="m-l-18">
          <span className="dp-legend-price">
            {_(`my_plan.addons.conversations.plans_from_legend`)}
          </span>
          <h2>
            US$ <FormattedNumber value={price} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">{_(`my_plan.addons.conversations.month_legend`)}</span>
        </div>
      </div>
    </>
  );
};

export const Conversations = ({ conversation }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.conversations.title`)}
      icon={'iconapp-chatting'}
      description={_(`my_plan.addons.conversations.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={'#'}
      buyButtonText={conversation.plan.buttonText}
      buyButtonUrl={conversation.plan.buttonUrl}
    ></Card>
  );
};
