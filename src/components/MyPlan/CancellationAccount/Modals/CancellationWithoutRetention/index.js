import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { useState } from 'react';

export const DELAY_BEFORE_REDIRECT = 3000;

export const CancellationWithoutRetentionModal = InjectAppServices(
  ({
    accountCancellationRequest,
    handleCloseModal,
    handleSuccessCancelAccount,
    dependencies: { dopplerBillingUserApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mapCancellationAccountRequestModel = () => {
      const data = {
        firstName: '',
        lastName: '',
        phone: '',
        contactSchedule: '',
        cancellationReason: accountCancellationRequest.cancellationReason,
      };

      return data;
    };

    const cancelWithoutRetention = async () => {
      setIsSubmitting(true);
      const result = await dopplerBillingUserApiClient.cancellationAccount(
        mapCancellationAccountRequestModel(),
      );
      if (result.success) {
        handleSuccessCancelAccount();
      } else {
        setErrorMessage(true);
        setIsSubmitting(false);
      }
    };

    return (
      <div className="modal" id="modal-cancel-subscription-without-retention">
        <div className="modal-content--medium">
          <span className="close" onClick={handleCloseModal}></span>
          <h2 className="modal-title">
            <FormattedMessage
              id={'my_plan.cancellation.without_retention_modal.title'}
              values={{
                br: <br />,
              }}
            />
          </h2>
          <div className="m-t-18 m-b-18">
            <p>{_(`my_plan.cancellation.without_retention_modal.description`)}</p>
          </div>
          {errorMessage ? (
            <div className="dp-wrap-message dp-wrap-cancel m-b-12">
              <span className="dp-message-icon"></span>
              <div className="dp-content-message">
                {_(`my_plan.cancellation.without_retention_modal.error_message`)}
              </div>
            </div>
          ) : null}
          <hr />
          <ul className="dp-group-buttons">
            <li className="buttons-container">
              <button
                type="button"
                className="dp-button button-medium ctaTertiary m-r-18"
                onClick={handleCloseModal}
              >
                {_('my_plan.cancellation.without_retention_modal.cancel_button')}
              </button>
              <button
                type="button"
                className={`dp-button button-medium primary-green ${
                  (isSubmitting && ' button--loading') || ''
                }`}
                onClick={cancelWithoutRetention}
              >
                {_('my_plan.cancellation.without_retention_modal.accept_button')}
              </button>
              {/* </div> */}
            </li>
          </ul>
        </div>
      </div>
    );
  },
);
