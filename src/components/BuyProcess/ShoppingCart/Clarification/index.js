import { useIntl } from 'react-intl';
import { PaymentMethodType, PLAN_TYPE } from '../../../../doppler-types';

export const Clarification = ({
  paymentMethodType,
  planType,
  isFree,
  majorThat21st,
  currentMonthTotal,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getTaxesLegend = () => {
    switch (planType) {
      case PLAN_TYPE.byCredit:
        return paymentMethodType === PaymentMethodType.creditCard
          ? ''
          : `*${_('checkoutProcessForm.purchase_summary.explanatory_legend_by_credits')}`;
      case PLAN_TYPE.byContact:
      case PLAN_TYPE.byEmail:
        return paymentMethodType === PaymentMethodType.creditCard ? (
          <div>
            {!isFree && majorThat21st && (
              <div>{`${_('checkoutProcessForm.purchase_summary.upgrade_plan_legend')}`}</div>
            )}
            <div className={!isFree && currentMonthTotal === 0 ? `m-t-12` : ''}>
              {`*${_('checkoutProcessForm.purchase_summary.explanatory_legend')}`}
            </div>
          </div>
        ) : (
          <div>
            {`*${_('checkoutProcessForm.purchase_summary.transfer_explanatory_legend')}`}
            {!isFree && majorThat21st && (
              <div className="m-t-12">
                {`${_('checkoutProcessForm.purchase_summary.upgrade_plan_legend')}`}
              </div>
            )}
            <div className="m-t-12">
              {`${_('checkoutProcessForm.purchase_summary.transfer_explanatory_legend2')}`}
            </div>
          </div>
        );
      default:
        return '';
    }
  };

  return <div className="dp-renewal">{getTaxesLegend()}</div>;
};
