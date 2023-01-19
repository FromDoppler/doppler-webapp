import { SAVED } from '../index';
import { FieldItem } from '../../../../form-helpers/form-helpers';
import { useIntl } from 'react-intl';

export const StatusMessage = ({ status }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <FieldItem className="field-item">
      <div
        className={`dp-wrap-message dp-wrap-${status === SAVED ? 'success' : 'cancel'}`}
        role="alert"
        aria-label={status === SAVED ? 'success' : 'cancel'}
      >
        <span className="dp-message-icon" />
        <div className="dp-content-message">
          <p>
            {_(
              status === SAVED
                ? 'updatePaymentMethod.payment_method.transfer.send_email_success_message'
                : 'updatePaymentMethod.payment_method.transfer.send_email_error_message',
            )}
          </p>
        </div>
      </div>
      <hr className="m-t-24 m-b-24" />
    </FieldItem>
  );
};
