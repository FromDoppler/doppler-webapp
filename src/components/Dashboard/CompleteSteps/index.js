import { FormattedMessage, useIntl } from 'react-intl';
import { Loading } from '../../Loading/Loading';

export const CompleteSteps = ({ loading, onClick }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      {loading && <Loading />}
      <div className="dp-wrap-message dp-wrap-success" data-testid="enable-quick-actions">
        <span className="dp-message-icon" />
        <div className="dp-content-message">
          <FormattedMessage
            id="dashboard.first_steps.completed_message"
            values={{
              Paragraph: (chunk) => <p>{chunk}</p>,
              Button: (chunk) => (
                <button type="button" className="dp-button link-green" onClick={onClick}>
                  {chunk}
                </button>
              ),
              Bold: (chunk) => <strong>{chunk}</strong>,
            }}
          />
          <button type="button" className="dp-message-link" onClick={onClick}>
            {_('dashboard.first_steps.enable_quick_actions')}
          </button>
        </div>
      </div>
    </>
  );
};
