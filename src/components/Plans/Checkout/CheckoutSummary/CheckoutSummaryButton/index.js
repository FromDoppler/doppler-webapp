import { MAX_PERCENTAGE } from '../CheckoutSummary';
import { useIntl } from 'react-intl';
import { paymentType } from '../../PaymentMethod/PaymentMethod';

export const CheckoutSummaryButton = ({ paymentMethod, discountByPromocode }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  if (
    [paymentType.transfer, paymentType.mercadoPago].includes(paymentMethod) &&
    discountByPromocode !== MAX_PERCENTAGE
  ) {
    return (
      <div className="m-t-24">
        <p>
          <i>{_(`checkoutProcessSuccess.transfer_explore_message`)}</i>
        </p>
        <div className="dp-checkout-content">
          <a href={'/dashboard'} className="dp-button button-medium primary-green m-t-24">
            {_('checkoutProcessSuccess.transfer_explore_button')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <a href={'/dashboard'} className="dp-button button-medium primary-green m-t-24">
      {_('checkoutProcessSuccess.start_using_new_plan_button')}
    </a>
  );
};
