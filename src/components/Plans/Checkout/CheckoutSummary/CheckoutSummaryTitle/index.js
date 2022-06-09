import { useIntl } from 'react-intl';
import { paymentType } from '../../PaymentMethod/PaymentMethod';

const getTitle = (paymentMethod, upgradePending) => {
  if (paymentMethod === paymentType.transfer && upgradePending) {
    return {
      smallTitle: 'checkoutProcessSuccess.transfer_purchase_finished_title',
      largeTitle: 'checkoutProcessSuccess.transfer_title',
    };
  } else {
    if (paymentMethod === paymentType.mercadoPago && upgradePending) {
      return {
        smallTitle: 'checkoutProcessSuccess.mercado_pago_purchase_finished_title',
        largeTitle: 'checkoutProcessSuccess.transfer_title',
      };
    }
  }
  return {
    smallTitle: 'checkoutProcessSuccess.purchase_finished_title',
    largeTitle: 'checkoutProcessSuccess.title',
  };
};

export const CheckoutSummaryTitle = ({ paymentMethod, upgradePending }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const title = getTitle(paymentMethod, upgradePending);

  return (
    <>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <nav className="dp-breadcrumb">
              <ul>
                <li>
                  <span className="dp-uppercase">{_(title.smallTitle)}</span>
                </li>
              </ul>
            </nav>
            <h1>{_(title.largeTitle)}</h1>
          </div>
        </div>
      </section>
    </>
  );
};
