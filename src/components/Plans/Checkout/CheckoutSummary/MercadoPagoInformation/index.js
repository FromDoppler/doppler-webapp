import { FormattedMessage, useIntl } from 'react-intl';

export const MercadoPagoInformation = ({ upgradePending }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <h4 className="m-t-24">{_(`checkoutProcessSuccess.mercado_pago_steps_title`)}</h4>
      <div className="dp-rowflex">
        <div className="col-sm-7 m-b-24">
          <div className="dp-checkout-content">
            <div className="dp-plan-detail">
              <ul className="dp-list-detail">
                {upgradePending && (
                  <li>
                    <span className="dp-wrapp-icon dpicon iconapp-mail-inbox" />
                    <span>
                      {_(`checkoutProcessSuccess.mercado_pago_check_email_with_invoice_message`)}
                    </span>
                  </li>
                )}
                <li>
                  <span className="dp-wrapp-icon dpicon iconapp-bill" />
                  <span>{_(`checkoutProcessSuccess.mercado_pago_pay_the_invoice_message`)}</span>
                </li>
                {upgradePending && (
                  <li>
                    <span className="dp-wrapp-icon dpicon iconapp-payment-failure" />
                    <span>{_(`checkoutProcessSuccess.mercado_pago_error_in_pay`)}</span>
                  </li>
                )}
                <li>
                  <span className="dp-wrapp-icon dpicon iconapp-send-message" />
                  <span>
                    <FormattedMessage
                      id={`checkoutProcessSuccess.mercado_pago_contact_support`}
                      values={{
                        Bold: (chunk) => <strong>{chunk}</strong>,
                      }}
                    />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <hr className="dp-separator" />
    </>
  );
};
