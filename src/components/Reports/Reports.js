import React, { useState, useEffect } from 'react';
import ReportsFilters from './ReportsFilters/ReportsFilters';
import ReportsBox from './ReportsBox/ReportsBox';
import ReportsPageRanking from './ReportsPageRanking/ReportsPageRanking';
import ReportsTrafficSources from './ReportsTrafficSources/ReportsTrafficSources';
import ReportsDailyVisits from './ReportsDailyVisits/ReportsDailyVisits';
import ReportsHoursVisits from './ReportsHoursVisits/ReportsHoursVisits';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessage } from 'react-intl';
import {
  SiteTrackingRequired,
  SiteTrackingNotAvailableReasons,
} from '../SiteTrackingRequired/SiteTrackingRequired';
import { Helmet } from 'react-helmet';
import { Loading } from '../Loading/Loading';
import { addDays } from '../../utils';

const periodSelectedDaysDefault = 7;

const getCurrentDate = (date) => {
  return new Date(date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());
};

/**
 * @param { Object } props
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */

const Reports = ({ dependencies: { datahubClient } }) => {
  const dateNow = getCurrentDate(new Date());
  const [state, setState] = useState({
    periodSelectedDays: periodSelectedDaysDefault,
    dateFrom: addDays(dateNow, periodSelectedDaysDefault * -1),
    dateTo: dateNow,
  });

  const changeDomain = async (name) => {
    const domainFound = state.domains.find((item) => item.name === name);
    setState((prevState) => ({ ...prevState, domainSelected: domainFound }));
  };

  const changePeriod = (days) => {
    const dateNow = getCurrentDate(new Date());
    const dateFrom = addDays(dateNow, days * -1);
    setState((prevState) => ({
      ...prevState,
      periodSelectedDays: days,
      dateFrom: dateFrom,
      dateTo: dateNow,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const domains = await datahubClient.getAccountDomains();
      setState((prevState) => ({
        ...prevState,
        domains: domains,
        domainSelected: domains.length ? domains[0] : null,
      }));
    };

    fetchData();
  }, [datahubClient]);

  return (
    <>
      <FormattedMessage id="reports_title">
        {(reports_title) => (
          <Helmet>
            <title>{reports_title}</title>
          </Helmet>
        )}
      </FormattedMessage>
      {state.domains && !state.domainSelected ? (
        <SiteTrackingRequired reason={SiteTrackingNotAvailableReasons.thereAreNotDomains} />
      ) : (
        <>
          <ReportsFilters
            changeDomain={changeDomain}
            domains={state.domains}
            domainSelected={state.domainSelected}
            periodSelectedDays={state.periodSelectedDays}
            changePeriod={changePeriod}
          />
          {!state.domains ? (
            <Loading />
          ) : (
            <section className="container-reports">
              <div className="wrapper-kpi">
                <ReportsBox
                  domainName={state.domainSelected.name}
                  periodSelectedDays={state.periodSelectedDays}
                  dateTo={state.dateTo}
                  dateFrom={state.dateFrom}
                  withoutEmail
                />
                <ReportsBox
                  domainName={state.domainSelected.name}
                  dateTo={state.dateTo}
                  dateFrom={state.dateFrom}
                  withEmail
                />
              </div>
              <ReportsDailyVisits
                domainName={state.domainSelected.name}
                dateFrom={state.dateFrom}
                dateTo={state.dateTo}
              />
              <ReportsTrafficSources
                domainName={state.domainSelected.name}
                dateFrom={state.dateFrom}
              />
              <ReportsHoursVisits
                domainName={state.domainSelected.name}
                dateTo={state.dateTo}
                dateFrom={state.dateFrom}
              />
              <ReportsPageRanking
                domainName={state.domainSelected.name}
                dateTo={state.dateTo}
                dateFrom={state.dateFrom}
              />
            </section>
          )}
        </>
      )}
    </>
  );
};

export default InjectAppServices(Reports);
