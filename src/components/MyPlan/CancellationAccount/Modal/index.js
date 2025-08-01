import { FormattedMessage, useIntl } from 'react-intl';
import { CancellationAccountForm } from './Form';

export const CancellationAccountModal = ({ showModal, handleCloseModal, handleSubmit }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  if (!showModal) {
    return <></>;
  }

  return (
    <div className="modal" id="modal-cancel-subscription">
      <div className="modal-content--medium">
        <span className="close" onClick={handleCloseModal}></span>
        <h2 className="modal-title">{_(`my_plan.cancellation.title`)}</h2>
        <p>
          <FormattedMessage
            id={'my_plan.cancellation.description'}
            values={{
              Strong: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        </p>
        <CancellationAccountForm handleSubmit={handleSubmit}></CancellationAccountForm>
      </div>
    </div>
  );
};
