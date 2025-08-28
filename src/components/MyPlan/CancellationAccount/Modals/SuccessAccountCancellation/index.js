import { FormattedMessage, useIntl } from 'react-intl';

export const SuccessAccountCancellation = ({ isFreeAccount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const closePopup = () => {
    window.location.href = '/login';
  };

  return (
    <div className="modal" id="modal-success-account-cancellation">
      <div className="modal-content--medium">
        <span className="close" onClick={closePopup}></span>
        <h2 className="modal-title">
          <FormattedMessage
            id={'my_plan.cancellation.success_account_cancellation.title'}
            values={{
              br: <br />,
            }}
          />
        </h2>
        <div className="m-t-18 m-b-18">
          <p>
            {_(
              `my_plan.cancellation.success_account_cancellation.${
                isFreeAccount ? 'description' : 'paid_users_description'
              }`,
            )}
          </p>
        </div>
        <hr />
        <ul className="dp-group-buttons">
          <li>
            <button
              type="button"
              className="dp-button button-medium primary-green"
              onClick={closePopup}
            >
              {_('my_plan.cancellation.success_account_cancellation.close_button')}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
