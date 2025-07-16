import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Card } from '../Card';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const PriceSection = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const price = 26.5;

  return (
    <>
      <div className="col-sm-6">
        <div>
          <span className="dp-legend-price">
            <FormattedMessage
              id={`my_plan.addons.transactional_emails.email_plan_legend`}
              values={{
                emails: 50000,
              }}
            />
          </span>
          <h2>
            US$ <FormattedNumber value={price} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">
            {_(`my_plan.addons.transactional_emails.month_legend`)}
          </span>
        </div>
      </div>
    </>
  );
};

export const TransactionalEmails = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.transactional_emails.title`)}
      icon={'iconapp-send-mail'}
      description={_(`my_plan.addons.transactional_emails.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={_(`my_plan.addons.transactional_emails.more_information_link`)}
      buyButtonText={_(`my_plan.addons.activate_now_button`)}
      buyButtonUrl={_(`my_plan.addons.transactional_emails.buy_url`)}
    ></Card>
  );
};
