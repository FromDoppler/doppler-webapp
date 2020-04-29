import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FormattedDateRangeText } from '../../shared/FormattedDateRangeText/FormattedDateRangeText';
import { Loading } from '../../Loading/Loading';

/**
 * @param { Object } props - props
 * @param { import('../../../services/pure-di').AppServices } props.dependencies
 */
const ReportsBox = ({ dateFrom, dateTo, emailFilter, today, visits, loading }) => {
  return (
    <div className={visits === 0 ? 'dp-box-shadow warning--kpi' : 'dp-box-shadow'}>
      {loading ? (
        <Loading />
      ) : emailFilter === 'with_email' ? (
        <>
          <div className="box-border--bottom">
            <h3 className="number-kpi">{visits}</h3>
            <h6>
              <FormattedMessage id="reports_box.visits_with_email" />
            </h6>
            <small className="date-range">
              <FormattedDateRangeText dateFrom={dateFrom} dateTo={dateTo} today={today} />
            </small>
          </div>
          <p className="text-kpi">
            <FormattedMessage id="reports_box.visits_description_with_email" />
          </p>
        </>
      ) : emailFilter === 'without_email' ? (
        <>
          <div className="box-border--bottom">
            <h3 className="number-kpi">{visits}</h3>
            <h6>
              <FormattedMessage id="reports_box.visits_without_emails" />
            </h6>
            <small className="date-range">
              <FormattedDateRangeText dateFrom={dateFrom} dateTo={dateTo} today={today} />
            </small>
          </div>
          <p className="text-kpi">
            <FormattedMessage id="reports_box.visits_description_without_emails" />
          </p>
        </>
      ) : (
        <p className="dp-boxshadow--error bounceIn">
          <FormattedMessage id="common.unexpected_error" />
        </p>
      )}
    </div>
  );
};

export default ReportsBox;
