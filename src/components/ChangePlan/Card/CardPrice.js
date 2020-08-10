import React from 'react';
import { useIntl } from 'react-intl';

const CardPrice = ({ currency, children }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="dp-price">
      <span className="dp-time-lapse-top">{_('change_plan.since')}</span>
      <div className="dp-amount">
        <span className="dp-plan-currency">{currency}</span>
        <span className="dp-money-number">{children}</span>
      </div>
      <span className="dp-time-lapse-bottom">{_('change_plan.per_month')}</span>
    </div>
  );
};

export default CardPrice;
