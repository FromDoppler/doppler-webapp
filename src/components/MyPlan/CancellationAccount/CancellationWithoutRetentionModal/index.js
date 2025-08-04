import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../services/pure-di';

export const DELAY_BEFORE_REDIRECT = 3000;

export const CancellationWithoutRetentionModal = InjectAppServices(({ showModal, handleCloseModal, dependencies: { dopplerBillingUserApiClient } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const mapCancellationAccountRequestModel = () => {
    const data = {
      FirstName: '',
      LastName: '',
      Phone: '',
      ContactSchedule: '',
      CancellationReason: '',
    };

    return data;
  };

  const cancelWithoutRetention = async () => {
      const result = await dopplerBillingUserApiClient.cancellationAccount(mapCancellationAccountRequestModel());
      if (result) {
        handleCloseModal();
      }
  }

  if (!showModal) {
    return <></>;
  }

  return (
    <div className="modal" id="modal-cancel-subscription-without-retention">
      <div className="modal-content--medium">
        <span className="close" onClick={handleCloseModal}></span>
        <h2 className="modal-title">{_(`my_plan.cancellation.without_retention_modal.title`)}</h2>
        <div className='m-t-18 m-b-18'>
          <p>{_(`my_plan.cancellation.without_retention_modal.description`)}</p>
        </div>
        <hr />
        <ul className="dp-group-buttons">
          <li>
            <button
              type="button"
              className="dp-button button-medium ctaTertiary m-r-18"
              onClick={handleCloseModal}
            >
              {_('my_plan.cancellation.without_retention_modal.cancel_button')}
            </button>
            <button
              type="button"
              className="dp-button button-medium primary-green"
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
});
