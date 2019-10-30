import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, FormattedDate } from 'react-intl';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
import * as S from './ReportsFilters.styles';

const ReportsFilters = ({
  domains,
  domainSelected,
  changeDomain,
  changePeriod,
  periodSelectedDays,
}) => {
  return (
    <header className="report-filters">
      <div className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h3>
              <FormattedMessage id="reports_filters.title" />
            </h3>
            <FormattedHTMLMessage id="reports_filters.description_HTML" />
          </div>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <form action="#" className="form-filters">
              <div className="col-sm-12 col-md-4 col-lg-4 m-b-12">
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
                    <S.DropdownLegend>
                      {domainSelected.verified_date ? (
                        <>
                          <FormattedMessage id="reports_filters.verified_domain" />{' '}
                          <span>
                            <FormattedDate value={domainSelected.verified_date} />
                          </span>
                        </>
                      ) : (
                        <FormattedMessageMarkdown id="reports_filters.domain_not_verified_MD" />
                      )}
                    </S.DropdownLegend>
                  ) : null}
                </fieldset>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4 m-b-12">
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
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4 m-b-12">
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
                    <FormattedMessage
                      id="reports_filters.week_with_plural"
                      values={{ weeksCount: 1 }}
                    >
                      {(message) => <option value="7">{message}</option>}
                    </FormattedMessage>
                    <FormattedMessage
                      id="reports_filters.week_with_plural"
                      values={{ weeksCount: 2 }}
                    >
                      {(message) => <option value="14">{message}</option>}
                    </FormattedMessage>
                    <FormattedMessage
                      id="reports_filters.week_with_plural"
                      values={{ weeksCount: 3 }}
                    >
                      {(message) => <option value="21">{message}</option>}
                    </FormattedMessage>
                  </select>
                </fieldset>
              </div>
            </form>
            <span className="arrow" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ReportsFilters;
