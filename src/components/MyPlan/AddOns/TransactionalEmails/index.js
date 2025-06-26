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

  const price = 26.50;

  return (
    <>
      <div className="col-sm-3">
        <div className="m-l-18">
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
      <div className="col-sm-3"></div>
    </>
  );
};

export const TransactionalEmails = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.transactional_emails.title`)}
      icon={'iconapp-mail-info'}
      description={_(`my_plan.addons.transactional_emails.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={'https://help.fromdoppler.com/es/doppler-relay-conoce-servicio-email-transaccional/'}
      buyButtonText={_(`my_plan.addons.buy_button`)}
      buyButtonUrl={'https://www.dopplerrelay.com/'}
    ></Card>
  );
};
