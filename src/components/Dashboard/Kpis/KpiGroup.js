import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Loading } from '../../Loading/Loading';

export const DashboardIconSubTitle = ({ title, iconClass }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <h2>
      <span className={`dp-dashboard-icon-title ${iconClass}`}></span>
      {_(title)}
    </h2>
  );
};

export const DashboardIconLink = ({ linkTitle, link }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <a href={`${link}`} className="dp-dashboard-title-link">
      {_(linkTitle)}
    </a>
  );
};

export const KpiGroup = ({ children, loading, disabled, overlay }) => {
  return (
    <div className={`dp-rowflex dp-dashboard-panel ${disabled ? `disabled` : ''}`}>
      {loading && <Loading />}
      {children}
      <div className={`dp-overlay ${disabled ? `show` : ''}`}>{overlay}</div>
    </div>
  );
};

KpiGroup.propTypes = {
  children: PropTypes.node,
  overlay: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};
