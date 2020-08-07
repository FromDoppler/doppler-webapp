import React from 'react';
import { useIntl } from 'react-intl';

const CardPrice = ({ currency, children }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div class="dp-price" data-start={_('change_plan.since')}>
      <div class="dp-amount">
        <span class="dp-money-number" data-money={currency}>
          {children}
        </span>
        <span>{_('change_plan.per_month')}</span>
      </div>
    </div>
  );
};

export default CardPrice;
