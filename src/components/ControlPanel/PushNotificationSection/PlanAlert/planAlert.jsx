import React from 'react';
import { useIntl } from 'react-intl';
import { BoxMessage } from '../../../styles/messages';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';
import { Link } from 'react-router-dom';

export const PlanAlert = ({ days, availableSends, isUserFree, linkUrl }) => {
  const intl = useIntl();

  const styles = {
    'trial-warning': 'dp-wrap-info',
    'trial-ended': 'dp-wrap-cancel',
    'excess-shipments': 'dp-wrap-warning',
  };

  const { type, message, message2, actionLabel } = (() => {
    if (!isUserFree && availableSends < 0) {
      return {
        type: 'excess-shipments',
        message: 'push_notification_section.panel.exceeded',
        message2: 'push_notification_section.panel.exceeded2',
        actionLabel: intl.formatMessage({
          id: 'push_notification_section.panel.change_plan',
        }),
      };
    }

    if (isUserFree && (days < 1 || availableSends < 0)) {
      return {
        type: 'trial-ended',
        message: 'push_notification_section.panel.date_expiration_error',
        actionLabel: intl.formatMessage({
          id: 'push_notification_section.panel.purchase_plan',
        }),
      };
    }

    return {
      type: 'trial-warning',
      message:
        days === 1
          ? 'push_notification_section.panel.countdown_message_singular'
          : 'push_notification_section.panel.countdown_message_plural',
      actionLabel: intl.formatMessage({
        id: 'push_notification_section.panel.purchase_plan',
      }),
    };
  })();

  return !isUserFree && availableSends > 0 ? null : (
    <BoxMessage className={`dp-wrap-message ${styles[type]} bounceIn`} spaceTopBottom>
      <span className="dp-message-icon"></span>
      <span className="dp-content-message dp-content-full">
        <span>
          <FormattedMessageMarkdown id={message} values={{ days, availableSends }} />
          {message2 && <FormattedMessageMarkdown id={message2} />}
        </span>
        <Link to={linkUrl} className="dp-message-link">
          {actionLabel}
        </Link>
      </span>
    </BoxMessage>
  );
};
