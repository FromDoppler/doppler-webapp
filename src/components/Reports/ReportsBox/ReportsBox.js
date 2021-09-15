import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FormattedDateRangeText } from '../../shared/FormattedDateRangeText/FormattedDateRangeText';
import { Loading } from '../../Loading/Loading';

/**
 * @param { Object } props - props
 * @param { import('../../../services/pure-di').AppServices } props.dependencies
 */
const ReportsBox = ({ dateFrom, dateTo, emailFilter, today, visits, loading }) => {
  const withEmail = 'with_email' === emailFilter;
  const totalVisits = visits ?? 0;
  const descriptionKey = withEmail
    ? 'reports_box.visits_description_with_email'
    : 'reports_box.visits_description_without_emails';
  const titleKey = withEmail
    ? 'reports_box.visits_with_email'
    : 'reports_box.visits_without_emails';

  return (
    <div className={visits === 0 ? 'dp-box-shadow warning--kpi' : 'dp-box-shadow'}>
      {loading && <Loading />}
      {['with_email', 'without_email'].includes(emailFilter) ? (
        <>
          <div className="box-border--bottom">
            <h3 className="number-kpi">{totalVisits}</h3>
            <h6>
              <FormattedMessage id={titleKey} />
            </h6>
            <small className="date-range">
              <FormattedDateRangeText dateFrom={dateFrom} dateTo={dateTo} today={today} />
            </small>
          </div>
          <p className="text-kpi">
            <FormattedMessage id={descriptionKey} />
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
