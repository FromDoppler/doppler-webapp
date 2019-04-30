import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';

const ReportsFilters = ({
  domains,
  domainSelected,
  changeDomain,
  changePeriod,
  periodSelectedDays,
}) => {
  return (
    <header className="report-filters">
      <div className="report-wrapper">
        <h3>
          <FormattedMessage id="reports_filters.title" />
        </h3>
        <p>
          <FormattedMessage id="reports_filters.description" />
        </p>
        <form action="#" className="form-filters">
          <fieldset className="filter">
            <label htmlFor="domain">
              <FormattedMessage id="reports_filters.domain" />
            </label>
            <span className="dropdown-arrow" />
            <select
              onChange={(event) => changeDomain(event.target.value)}
              id="domain"
              disabled={!domains || !domains.length}
              value={domainSelected ? domainSelected.name : ''}
            >
              {domains &&
                domains.map((domain, index) => (
                  <option key={index} value={domain.name}>
                    {domain.name}
                  </option>
                ))}
            </select>
            {domainSelected ? (
              <span className="verified--domain">
                {domainSelected.verified_date ? (
                  <>
                    <FormattedMessage id="reports_filters.verified_domain" />{' '}
                    <FormattedDate value={domainSelected.verified_date} timeZone="UTC" />
                  </>
                ) : (
                  <FormattedMessage id="reports_filters.domain_not_verified" />
                )}
              </span>
            ) : null}
          </fieldset>
          <fieldset className="filter">
            <label htmlFor="pages">
              <FormattedMessage id="reports_filters.pages" />
            </label>
            <span className="dropdown-arrow" />
            <select value="-1" id="pages" name="pages" disabled="disabled">
              <FormattedMessage id="reports_filters.all_pages">
                {(message) => <option value="-1">{message}</option>}
              </FormattedMessage>
            </select>
          </fieldset>
          <fieldset className="filter">
            <label htmlFor="range_time">
              <FormattedMessage id="reports_filters.rank_time" />
            </label>
            <span className="dropdown-arrow" />
            <select
              id="range_time"
              value={periodSelectedDays}
              disabled={!domains || !domains.length}
              onChange={(event) => changePeriod(parseInt(event.target.value))}
            >
              <FormattedMessage id="reports_filters.rank_time_item1">
                {(message) => <option value="7">{message}</option>}
              </FormattedMessage>
              <FormattedMessage id="reports_filters.rank_time_item2">
                {(message) => <option value="14">{message}</option>}
              </FormattedMessage>
              <FormattedMessage id="reports_filters.rank_time_item3">
                {(message) => <option value="21">{message}</option>}
              </FormattedMessage>
            </select>
          </fieldset>
        </form>
        <span className="arrow" />
      </div>
    </header>
  );
};

export default ReportsFilters;
