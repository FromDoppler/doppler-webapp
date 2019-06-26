import React from 'react';

const Notifications = ({ plan, notifications, emptyNotificationText }) => {
  // check if we're always going to show notifications
  const showNotifications = plan.isFreeAccount && notifications.length;
  const dataCountAttr = showNotifications ? { 'data-count': notifications.length } : {};
  return (
    <>
      <span className="user-menu--open active" {...dataCountAttr}>
        <span className="ms-icon icon-notification"></span>
      </span>
      <div className="user-menu helper--right dp-notifications">
        <div className="dp-msj-notif">
          {!showNotifications ? (
            <i>{emptyNotificationText}</i>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: notifications[0] }} />
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
