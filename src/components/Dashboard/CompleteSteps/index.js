import { FormattedMessage } from 'react-intl';
import { Loading } from '../../Loading/Loading';

export const CompleteSteps = ({ loading }) => {
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
                <button type="button" className="dp-button link-green">
                  {chunk}
                </button>
              ),
              Bold: (chunk) => <strong>{chunk}</strong>,
            }}
          />
        </div>
      </div>
    </>
  );
};
