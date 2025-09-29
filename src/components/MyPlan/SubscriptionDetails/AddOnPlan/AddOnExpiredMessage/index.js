import { FormattedMessage } from 'react-intl';

export const AddOnExpiredMessage = () => {
  return (
    <div className="dp-wrap-message dp-wrap-info">
      <span className="dp-message-icon"></span>
      <div className="dp-content-message">
        <p>
          <FormattedMessage
            id={'my_plan.subscription_details.addon_plan_expired_message'}
            values={{
              bold: (chunks) => <b>{chunks}</b>,
              br: <br />,
            }}
          />
        </p>
      </div>
    </div>
  );
};
