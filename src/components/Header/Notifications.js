import React from 'react';
import { FormattedMessage } from 'react-intl';

const Notifications = ({ notifications, emptyNotificationText }) => {
  const showNotifications = notifications && notifications.length;
  const dataCountAttr = showNotifications ? { 'data-count': notifications.length } : {};
  return (
    <>
      <span className="user-menu--open active" {...dataCountAttr}>
        <span className="ms-icon icon-notification"></span>
      </span>
      <div className="user-menu helper--right dp-notifications">
        <div className="dp-msj-notif">
          {!showNotifications ? (
            <i>
              {emptyNotificationText ? (
                emptyNotificationText
              ) : (
                <FormattedMessage id="empty_notification_text" />
              )}
            </i>
          ) : (
            notifications.map((notification, index, currentNotifications) => (
              <div key={index + 'notification'}>
                <div dangerouslySetInnerHTML={{ __html: notification }} />
                {index < currentNotifications.length - 1 ? (
                  <>
                    <hr />
                    <br />
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
