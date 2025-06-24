import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const SmsPlan = ({ sms }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <article className="dp-wrapper-plan">
      <header>
        <div className="dp-title-plan">
          <h3 className="dp-second-order-title">
            <span className="p-r-8 m-r-6">{_(`my_plan.subscription_details.sms.title`)}</span>
            <span className="dpicon iconapp-mobile-message"></span>
          </h3>
        </div>
        <div className="dp-buttons--plan">
          <a
            type="button"
            className="dp-button button-medium primary-green dp-w-100 m-b-12"
            href={sms.buttonUrl}
          >
            {_(`my_plan.subscription_details.sms.load_button`)}
          </a>
        </div>
      </header>
      <ul className="dp-item--plan">
        <li>
          <p>
            <strong>
              <FormattedMessage
                id={`my_plan.subscription_details.sms.available_sms_amount`}
                values={{
                  amount: (
                    <FormattedNumber value={sms.remainingCredits ?? 0} {...numberFormatOptions} />
                  ),
                }}
              />
            </strong>
          </p>
        </li>
      </ul>
    </article>
  );
};
