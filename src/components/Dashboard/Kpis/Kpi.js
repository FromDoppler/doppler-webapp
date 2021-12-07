import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

export const Kpi = ({ iconClass, kpiValue, kpiTitleId, kpiPeriodId = 'dashboard.lastMonth' }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="col-lg-4 col-md-4 col-sm-12" role="figure">
      <div className="dp-dashboard-kpi">
        <span className={`dp-dashboard-icon ${iconClass}`} />
        <span className="dp-kpi-value dp-bold">{kpiValue}</span>
        <p className="dp-kpi-title dp-bold">{_(kpiTitleId)}</p>
        <p className="dp-kpi-period">{_(kpiPeriodId)}</p>
      </div>
    </div>
  );
};

Kpi.propTypes = {
  iconClass: PropTypes.string.isRequired,
  kpiValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  kpiTitleId: PropTypes.string.isRequired,
  kpiPeriodId: PropTypes.string,
};
