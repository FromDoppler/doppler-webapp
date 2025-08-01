import { useIntl } from 'react-intl';

export const CancellationWithoutRetentionModal = ({ showModal, handleCloseModal }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  if (!showModal) {
    return <></>;
  }

  return (
    <div className="modal" id="modal-cancel-subscription-without-retention">
      <div className="modal-content--medium">
        <span className="close" onClick={handleCloseModal}></span>
        <h2 className="modal-title">{_(`my_plan.cancellation.without_retention_modal.title`)}</h2>
        <p>{_(`my_plan.cancellation.without_retention_modal.description`)}</p>
        <hr />
        <ul className="dp-group-buttons">
          <li>
            {/* <div className="buttons-card"> */}
            <button
              type="button"
              className="dp-button button-medium primary-green"
              onClick={handleCloseModal}
            >
              {_('my_plan.cancellation.without_retention_modal.accept_button')}
            </button>
            {/* </div> */}
          </li>
        </ul>
      </div>
    </div>
  );
};
