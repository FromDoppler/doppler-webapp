import { useIntl } from 'react-intl';

export const UnexpectedError = ({ msgId, msg }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div data-testid="unexpected-error" className="dp-wrap-message dp-wrap-cancel">
      <span className="dp-message-icon" />
      <div className="dp-content-message">
        <p>{msgId ? _(msgId) : msg}</p>
      </div>
    </div>
  );
};
