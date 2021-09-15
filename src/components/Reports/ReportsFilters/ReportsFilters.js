import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import * as S from './ReportsFilters.styles';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';

export const placeholderDate = '--/--/----';

const ReportsFilters = ({
  domains,
  domainSelected,
  changeDomain,
  changePeriod,
  periodSelectedDays,
  isEnableWeeks,
}) => {
  return (
    <HeaderSection>
      <div className="col-sm-12 col-md-12 col-lg-12">
        <h2>
          <FormattedMessage id="reports_filters.title" />
        </h2>
        <FormattedMessageMarkdown linkTarget={'_blank'} id="reports_filters.description_MD" />
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
              <S.DropdownLegend>
                <span>
                  {domainSelected ? (
                    domainSelected.verified_date ? (
                      <>
                        <FormattedMessage id="reports_filters.verified_domain" />{' '}
                        <FormattedDate value={domainSelected.verified_date} />
                      </>
                    ) : (
                      <FormattedMessage id="reports_filters.no_information" />
                    )
                  ) : (
                    <>
                      <FormattedMessage id="reports_filters.verified_domain" /> {placeholderDate}
                    </>
                  )}
                </span>
              </S.DropdownLegend>
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
                <FormattedMessage id="reports_filters.today">
                  {(message) => <option value="0">{message}</option>}
                </FormattedMessage>
                <FormattedMessage id="reports_filters.week_with_plural" values={{ weeksCount: 1 }}>
                  {(message) => <option value="7">{message}</option>}
                </FormattedMessage>
                {isEnableWeeks ? (
                  <>
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
                  </>
                ) : null}
              </select>
            </fieldset>
          </div>
        </form>
      </div>
    </HeaderSection>
  );
};

export default ReportsFilters;
