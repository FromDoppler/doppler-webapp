import { useIntl } from 'react-intl';
import { PaymentMethodType } from '../../../../../doppler-types';

const getTitle = (allInvoicesProcessed, successful, anyPendingInvoices, paymentMethod) => {
  if (successful === 'false') {
    return {
      smallTitle: 'updatePaymentInformationSuccess.title',
      largeTitle: 'updatePaymentInformationSuccess.rejected_payments_title',
    };
  }

  if (paymentMethod !== PaymentMethodType.transfer) {
    if (anyPendingInvoices === 'true') {
      return {
        smallTitle: 'updatePaymentInformationSuccess.title',
        largeTitle: 'updatePaymentInformationSuccess.payment_pending_title',
      };
    }

    if (allInvoicesProcessed !== 'true') {
      return {
        smallTitle: 'updatePaymentInformationSuccess.title',
        largeTitle: 'updatePaymentInformationSuccess.not_all_invoices_processed_title',
      };
    }

    return {
      smallTitle: 'updatePaymentInformationSuccess.title',
      largeTitle: 'updatePaymentInformationSuccess.all_invoices_processed_title',
    };
  } else {
    return {
      smallTitle: 'updatePaymentInformationSuccess.title',
      largeTitle: 'updatePaymentInformationSuccess.transfer_title',
    };
  }
};

export const UpdatePaymentInformationSummaryTitle = ({
  allInvoicesProcessed,
  successful,
  anyPendingInvoices,
  paymentMethod,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const title = getTitle(allInvoicesProcessed, successful, anyPendingInvoices, paymentMethod);

  return (
    <section className="dp-container">
      <div className="dp-rowflex">
        <div className="col-sm-12 col-md-12 col-lg-12 m-l-12">
          {((successful === 'true' && allInvoicesProcessed === 'true') ||
            successful === 'false') && (
            <nav className="dp-breadcrumb">
              <ul>
                <li>
                  <span className="dp-uppercase">{_(title.smallTitle)}</span>
                </li>
              </ul>
            </nav>
          )}
          <nav className="p-t-0 p-b-18 p-l-12">
            <ul className="dp-rowflex">
              <li>
                <span className="dp-icon-kpis p-r-12">
                  <img
                    src={_('common.ui_library_image', {
                      imageUrl: `${
                        successful === 'true'
                          ? allInvoicesProcessed === 'true'
                            ? 'checkout-success.svg'
                            : 'three-points.svg'
                          : 'error-message.svg'
                      }`,
                    })}
                    alt=""
                  ></img>
                </span>
              </li>
              <li>
                <h1 className="p-b-6 p-t-6">{_(title.largeTitle)}</h1>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};
