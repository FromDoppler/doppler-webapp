import { useIntl } from 'react-intl';

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
                  <span className="dp-wrapp-icon">
                    <img
                      src={_('common.ui_library_image', {
                        imageUrl: `${'inbox.svg'}`,
                      })}
                      alt=""
                    ></img>
                  </span>
                  <span>
                    {_(`checkoutProcessSuccess.transfer_check_email_with_invoice_message`)}
                  </span>
                </li>
                <li>
                  <span className="dp-wrapp-icon">
                    <img
                      src={_('common.ui_library_image', {
                        imageUrl: `${'dollar-coin.svg'}`,
                      })}
                      alt=""
                    ></img>
                  </span>
                  <span>{_(`checkoutProcessSuccess.transfer_pay_the_invoice_message`)}</span>
                </li>
                <li>
                  <span className="dp-wrapp-icon">
                    <img
                      src={_('common.ui_library_image', {
                        imageUrl: `${'create-mail.svg'}`,
                      })}
                      alt=""
                    ></img>
                  </span>
                  <span>{_(`checkoutProcessSuccess.transfer_send_the_receipt_message`)}</span>
                </li>
                <li>
                  <span className="dp-wrapp-icon">
                    <img
                      src={_('common.ui_library_image', {
                        imageUrl: `${'approve-money.svg'}`,
                      })}
                      alt=""
                    ></img>
                  </span>
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
