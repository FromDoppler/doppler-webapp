import { FormattedMessage, useIntl } from 'react-intl';

export const SuccessScheduledCancellation = ({ handleClose }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="modal" id="modal-success-account-cancellation">
      <div className="modal-content--medium">
        <span className="close" onClick={handleClose}></span>
        <h2 className="modal-title">
          <FormattedMessage
            id={'my_plan.cancellation.success_scheduled_cancellation.title'}
            values={{
              br: <br />,
            }}
          />
        </h2>
        <div className="m-t-18 m-b-18">
          <p>
            <FormattedMessage
              id={'my_plan.cancellation.success_scheduled_cancellation.description'}
              values={{
                bold: (chunks) => <b>{chunks}</b>,
                br: <br />,
              }}
            />
          </p>
        </div>
        <hr />
        <ul className="dp-group-buttons">
          <li>
            <button
              type="button"
              className="dp-button button-medium primary-green"
              onClick={handleClose}
            >
              {_('my_plan.cancellation.success_scheduled_cancellation.accept_button')}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
