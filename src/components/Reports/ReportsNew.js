import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { BoxMessage } from '../styles/messages';
import { addDays, getStartOfDate } from '../../utils';
import ReportsFilters from './ReportsFilters/ReportsFilters';
import {
  SiteTrackingRequired,
  SiteTrackingNotAvailableReasons,
} from '../SiteTrackingRequired/SiteTrackingRequired';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';

// This value means the today date
const periodSelectedDaysDefault = 1;

/**
 * @param { Object } props
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */

const ReportsNew = ({ dependencies: { datahubClient } }) => {
  const today = getStartOfDate(new Date());
  const [state, setState] = useState({
    loading: true,
    periodSelectedDays: periodSelectedDaysDefault,
    dateFrom: addDays(today, periodSelectedDaysDefault * -1),
    dateTo: periodSelectedDaysDefault ? today : new Date(),
  });

  const changeDomain = async (name) => {
    const domainFound = state.domains.find((item) => item.name === name);
    setState((prevState) => ({ ...prevState, domainSelected: domainFound }));
  };

  const changePeriod = (daysToFilter) => {
    const today = getStartOfDate(new Date());
    setState((prevState) => ({
      ...prevState,
      periodSelectedDays: daysToFilter,
      dateFrom: addDays(today, daysToFilter * -1),
      dateTo: daysToFilter ? today : new Date(),
      dailyView: !daysToFilter,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const response = await datahubClient.getAccountDomains();
      if (response.success) {
        setState((prevState) => ({
          ...prevState,
          domains: response.value,
          domainSelected: response.value.length ? response.value[0] : null,
          loading: false,
        }));
      } else {
        setState({ loading: false });
      }
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
            isEnableWeeks
          />
          {state.loading ? (
            <Loading />
          ) : state.domains ? (
            <section className="dp-container">
              {!state.domainSelected.verified_date ? (
                <BoxMessage className="dp-msj-error bounceIn" spaceTopBottom>
                  <p>
                    <FormattedMessageMarkdown id="reports_filters.domain_not_verified_MD" />
                  </p>
                </BoxMessage>
              ) : null}
            </section>
          ) : (
            <BoxMessage className="dp-msj-error bounceIn" spaceTopBottom>
              <FormattedMessage id="common.unexpected_error" />
            </BoxMessage>
          )}
        </>
      )}
    </>
  );
};

export default InjectAppServices(ReportsNew);
