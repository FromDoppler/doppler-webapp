import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const DashboardIconSubTitle = ({ title, iconClass }) => {
  return (
    <h2>
      <span className={`dp-dashboard-icon-title ${iconClass}`}></span>
      {title}
    </h2>
  );
};

export const DashboardIconLink = ({ linkTitle, link }) => {
  return (
    <a href={`${link}`} className="dp-dashboard-title-link">
      {linkTitle}
    </a>
  );
};

export const KpiOverlay = ({ titleLink, kpiOverlayLink }) => {
  return (
    <div className="dp-overlay">
      <a href={`${kpiOverlayLink}`}>${titleLink}</a>
    </div>
  );
};

export const KpiGroup = ({ children, disabled }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const toggleShow = () => setShowOverlay(!showOverlay);

  return (
    <div
      className={`dp-rowflex dp-dashboard-panel ${disabled ? `disabled` : ``} ${
        showOverlay && disabled ? `show` : ``
      } `}
      onMouseLeave={toggleShow}
      onMouseEnter={toggleShow}
    >
      {children}
      <KpiOverlay
        titleLink="Empieza a enviar Campañas para ver tus resultados aquí"
        kpiOverlayLink="#"
      ></KpiOverlay>
    </div>
  );
};

KpiGroup.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
};
