import { FormattedMessage, useIntl } from 'react-intl';

export const TransferInformation = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <div className="dp-wrap-message dp-wrap-warning m-t-24">
        <span className="dp-message-icon"></span>
        <div className="dp-content-message">
          <p>{_(`checkoutProcessSuccess.transfer_warning_message`)}</p>
        </div>
      </div>
      <h4 className="m-t-24">{_(`checkoutProcessSuccess.transfer_steps_title`)}</h4>
      <div className="dp-rowflex">
        <div className="col-sm-7 m-b-24">
          <div className="dp-checkout-content">
            <div className="dp-plan-detail">
              <ul className="dp-list-detail">
                <li>
                  <span className="dp-wrapp-icon dpicon iconapp-mail-inbox" />
                  <span>
                    {_(`checkoutProcessSuccess.transfer_check_email_with_invoice_message`)}
                  </span>
                </li>
                <li>
                  <span className="dp-wrapp-icon dpicon iconapp-dollar-coin" />
                  <span>{_(`checkoutProcessSuccess.transfer_pay_the_invoice_message`)}</span>
                </li>
                <li>
                  <span className="dp-wrapp-icon dpicon iconapp-create-mail" />
                  <span>
                    <FormattedMessage
                      id={`checkoutProcessSuccess.transfer_send_the_receipt_message`}
                      values={{
                        Bold: (chunk) => <strong>{chunk}</strong>,
                      }}
                    />
                  </span>
                </li>
                <li>
                  <span className="dp-wrapp-icon dpicon iconapp-approve-money" />
                  <span>{_(`checkoutProcessSuccess.transfer_confirmation_message`)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div></div>
      <hr className="dp-separator"></hr>
    </>
  );
};
