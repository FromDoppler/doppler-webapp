import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { useState } from 'react';

export const DELAY_BEFORE_REDIRECT = 3000;

export const AddOnCancellationModal = InjectAppServices(
  ({
    addOnType,
    handleCloseModal,
    handleSuccessCancelAddOn,
    dependencies: { dopplerBillingUserApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cancelWithoutRetention = async () => {
      setIsSubmitting(true);
      const response = await dopplerBillingUserApiClient.cancellationAddOnPlan(addOnType);
      if (response.success) {
        handleSuccessCancelAddOn();
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
              id={'my_plan.cancellation.addon_modal.title'}
              values={{
                br: <br />,
              }}
            />
          </h2>
          <div className="m-t-18 m-b-18">
            <p>{_(`my_plan.cancellation.addon_modal.description`)}</p>
          </div>
          {errorMessage ? (
            <div className="dp-wrap-message dp-wrap-cancel m-b-12">
              <span className="dp-message-icon"></span>
              <div className="dp-content-message">
                {_(`my_plan.cancellation.addon_modal.error_message`)}
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
                {_('my_plan.cancellation.addon_modal.cancel_button')}
              </button>
              <button
                type="button"
                className={`dp-button button-medium primary-green ${
                  (isSubmitting && ' button--loading') || ''
                }`}
                onClick={cancelWithoutRetention}
              >
                {_('my_plan.cancellation.addon_modal.accept_button')}
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  },
);
