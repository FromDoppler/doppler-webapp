import { useIntl } from 'react-intl';
import { thousandSeparatorNumber } from '../../../../../utils';

export const PlanChatInformation = ({ planType, description, quantity, discount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <h4 className="dp-tit-plan-purchased">{_(`checkoutProcessSuccess.chat_plan_title`)}</h4>
      <ul className="dp-purchase-summary-list">
        <li>
          <span>{_(`checkoutProcessSuccess.plan_type`)}</span>
          <h3>{_(`checkoutProcessSuccess.chat_plan_label`)}</h3>
        </li>
        <li>
          <span>{_(`checkoutProcessSuccess.chat_plan_acquired_conversations`)}</span>
          <h3>{thousandSeparatorNumber(intl.defaultLocale, quantity)}</h3>
        </li>
        <li>
          {discount ? (
            <>
              <span>{_(`checkoutProcessSuccess.chat_plan_billing_title`)}</span>
              <h3>{_('checkoutProcessSuccess.discount_' + discount?.replace('-', '_'))}</h3>
            </>
          ) : (
            <>
              <span>{_(`checkoutProcessSuccess.chat_plan_billing_title`)}</span>
              <h3>{_(`checkoutProcessSuccess.chat_plan_default_billing`)}</h3>
            </>
          )}
        </li>
      </ul>
    </>
  );
};
