import React from 'react';
import { useIntl } from 'react-intl';
import { getPlanFee, thousandSeparatorNumber, unitPriceDecimals } from '../../../../utils';

export const PlanAgreement = ({ planData }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const discountPercentage = planData.discount?.discountPercentage;
  const monthsAmmount = planData?.discount?.monthsAmmount;
  const planFee = Math.round(getPlanFee(planData.plan));
  const planFeeWithDiscount = thousandSeparatorNumber(
    intl.defaultLocale,
    planFee * (1 - discountPercentage / 100) * monthsAmmount,
  );
  const extraEmailPrice = planData.plan.extraEmailPrice
    ? unitPriceDecimals(planData.plan.extraEmailPrice)
    : 0;

  const getAgreementDescription = (discountDescription) => {
    switch (discountDescription) {
      case 'quarterly':
      case 'half-yearly':
      case 'yearly':
        return _('plan_calculator.with_' + discountDescription.replace('-', '_') + '_discount');
      default:
        return '';
    }
  };

  return (
    <div className="dp-agreement">
      {discountPercentage ? (
        <p>
          {getAgreementDescription(planData.discount.description)}
          <strong>
            {' '}
            US$
            {planFeeWithDiscount}
          </strong>
        </p>
      ) : null}

      {planData.plan.type === 'monthly-deliveries' ? (
        <p className="dp-cost-per-email">
          {_('plan_calculator.cost_per_email')}{' '}
          <span className="dp-price-large-money">
            <strong>US${extraEmailPrice}</strong>
          </span>
        </p>
      ) : (
        ''
      )}
      <p className="dp-plan-disclaimer">{_('plan_calculator.discount_clarification')}</p>
    </div>
  );
};
