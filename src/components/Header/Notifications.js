import React from 'react';

const Notifications = ({ plan /*, notifications*/ }) => {
  const notifications = [
    "<strong>NUEVO: Comportamiento en Sitio</strong><br/><p class='text--small'>Programa un flujo automatizado de Emails que se env&#237;e de acuerdo a las p&#225;ginas que los Suscriptores hayan visitado en tu sitio. Para probarlo <a target='_self' href='https://app2.fromdoppler.com/ControlPanel/AccountPreferences/UpgradeAccount/?Plan=monthly'><strong>CONTRATA UN PLAN</strong></a>.</p>",
  ];
  const emptyNotificationText = 'No tienes notificaciones pendientes.';
  console.log(plan, notifications);
  return (
    <>
      <span className="user-menu--open active" data-count="1">
        <span className="ms-icon icon-notification"></span>
      </span>
      <div className="user-menu helper--right dp-notifications">
        <div className="dp-msj-notif">
          {/* revisar si siempre vamos a mostrar las notificaciones */}
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
