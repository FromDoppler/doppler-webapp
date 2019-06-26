import React from 'react';

const Notifications = ({ plan , notifications, emptyNotificationText }) => {
  let dataCount = [];
  dataCount = notifications.length? dataCount['data-count'] = notifications.length:'';
  console.log(plan, notifications);
  return (
    <>
      <span className="user-menu--open active" {...dataCount}>
        <span className="ms-icon icon-notification"></span>
      </span>
      <div className="user-menu helper--right dp-notifications">
        <div className="dp-msj-notif">
          {/* check if we're always going to show notifications */}
          {!plan.isFreeAccount || !notifications.length ? (
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
