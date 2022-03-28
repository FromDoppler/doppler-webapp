import { MAX_PERCENTAGE } from '../CheckoutSummary';
import { useIntl } from 'react-intl';
import { paymentType } from '../../PaymentMethod/PaymentMethod';

export const CheckoutSummaryTitle = ({ paymentMethod, discountByPromocode }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <nav className="dp-breadcrumb">
              <ul>
                <li>
                  <span className="dp-uppercase">
                    {paymentMethod === paymentType.transfer &&
                    discountByPromocode !== MAX_PERCENTAGE
                      ? _('checkoutProcessSuccess.transfer_purchase_finished_title')
                      : _('checkoutProcessSuccess.purchase_finished_title')}
                  </span>
                </li>
              </ul>
            </nav>
            <h1>
              {paymentMethod === paymentType.transfer && discountByPromocode !== MAX_PERCENTAGE
                ? _('checkoutProcessSuccess.transfer_title')
                : _('checkoutProcessSuccess.title')}
            </h1>
          </div>
        </div>
      </section>
    </>
  );
};
