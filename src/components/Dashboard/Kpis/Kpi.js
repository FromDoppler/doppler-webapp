import React from 'react';
import PropTypes from 'prop-types';

export const Kpi = ({ iconClass, kpiValue, kpiTitle, kpiPeriod, colSize }) => {
  return (
    <div className={`col-lg-${colSize} col-md-${colSize} col-sm-12`} role="figure">
      <div className="dp-dashboard-kpi">
        <span className={`dp-dashboard-icon ${iconClass}`}></span>
        <span className="dp-kpi-value">${kpiValue}</span>
        <p className="dp-kpi-title">${kpiTitle}</p>
        <p className="dp-kpi-period">${kpiPeriod}</p>
      </div>
    </div>
  );
};

Kpi.propTypes = {
  iconClass: PropTypes.string,
  kpiValue: PropTypes.string,
  kpiTitle: PropTypes.string,
  kpiPeriod: PropTypes.string,
  colSize: PropTypes.number,
};
