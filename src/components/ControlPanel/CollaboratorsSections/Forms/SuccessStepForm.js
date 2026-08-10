import { useIntl } from 'react-intl';

export const SuccessStepForm = ({ onFinish, buttonLabelMessageId = 'common.finish' }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <form className="awa-form form-request" data-testid="success-form">
      <div className="container-buttons">
        <button
          type="button"
          className="dp-button button-medium primary-green"
          onClick={() => onFinish(false)}
        >
          {_(buttonLabelMessageId)}
        </button>
      </div>
    </form>
  );
};
