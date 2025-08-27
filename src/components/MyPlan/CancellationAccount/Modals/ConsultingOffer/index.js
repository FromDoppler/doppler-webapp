import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { PLAN_TYPE } from '../../../../../doppler-types';

export const ConsultingOffer = InjectAppServices(
  ({
    accountCancellationRequest,
    planType,
    handleReturnAccountCancellationRequest,
    handleSuccessSetScheduledCancellation,
    handleClose,
    dependencies: { dopplerBillingUserApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const customerSuccessCalendarUrl = process.env.REACT_APP_DOPPLER_CUSTOMER_SUCCESS_CALENDAR_URL;

    const mapRequestAdviceModel = () => {
      const data = {
        firstName: accountCancellationRequest.firstName,
        lastName: accountCancellationRequest.lastName,
        phone: accountCancellationRequest.phone,
        contactSchedule: accountCancellationRequest.contactSchedule,
        cancellationReason: accountCancellationRequest.cancellationReason,
      };

      return data;
    };

    const requestAdvice = async () => {
      const setScheduledCancellationResult =
        await dopplerBillingUserApiClient.sendConsultingOfferNotification(mapRequestAdviceModel());

      if (setScheduledCancellationResult.success) {
        window.open(customerSuccessCalendarUrl, '_blank');
        handleClose();
      }
    };

    const closePopup = () => {
      handleReturnAccountCancellationRequest();
    };

    const mapScheduledCancellationRequestModel = () => {
      const data = {
        firstName: accountCancellationRequest.firstName,
        lastName: accountCancellationRequest.lastName,
        phone: accountCancellationRequest.phone,
        contactSchedule: accountCancellationRequest.contactSchedule,
        cancellationReason: accountCancellationRequest.cancellationReason,
        hasScheduledCancellation: true,
      };

      return data;
    };

    const continueWithCancellation = async () => {
      if (planType === PLAN_TYPE.byContact) {
        const setScheduledCancellationResult =
          await dopplerBillingUserApiClient.setScheduledCancellation(
            mapScheduledCancellationRequestModel(),
          );

        if (setScheduledCancellationResult.success) {
          handleSuccessSetScheduledCancellation();
        }
      } else {
        handleSuccessSetScheduledCancellation();
      }
    };

    return (
      <div className="modal" id="modal-pre-cancellation-subscription">
        <div className="modal-content--small">
          <button type="button" className="dp-arrow-back" onClick={closePopup}></button>

          <div className="dp-bg-retention">
            <img
              className="m-t-48"
              width={304}
              height={232}
              src={_('common.ui_library_image', {
                imageUrl: 'consulting-offer.png',
              })}
              alt="Consulting offer"
            ></img>
          </div>
          <h4 className="title">{_('my_plan.cancellation.consulting_offer.title')}</h4>
          <p>
            <FormattedMessage
              id={'my_plan.cancellation.consulting_offer.description'}
              values={{
                br: <br />,
              }}
            />
          </p>
          <div className="m-b-32">
            <button
              type="button"
              className="dp-button button-medium primary-green dp-w-100 m-b-18 m-t-12"
              onClick={requestAdvice}
            >
              {_('my_plan.cancellation.consulting_offer.request_advice_button')}
            </button>
            <button
              type="button"
              className="dp-link-cancellation m-b-24"
              onClick={continueWithCancellation}
            >
              {_('my_plan.cancellation.consulting_offer.continue_with_cancellation_button')}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
