import React, { useEffect, useReducer } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { fakeContactsSummary } from '../../../services/reports/index.double';
import { Kpi } from '../Kpis/Kpi';
import { DashboardIconLink, DashboardIconSubTitle, KpiGroup } from '../Kpis/KpiGroup';
import {
  ACTIONS_CONTACTS_SUMMARY,
  contactSummaryReducer,
  initContactSummaryReducer,
} from './reducers/contactSummaryReducer';

export const INITIAL_STATE_CONTACTS_SUMMARY = {
  loading: false,
  hasError: false,
  kpis: fakeContactsSummary,
};

export const ContactSummary = InjectAppServices(({ dependencies: { contactSummaryService } }) => {
  const [{ loading, kpis }, dispatch] = useReducer(
    contactSummaryReducer,
    INITIAL_STATE_CONTACTS_SUMMARY,
    initContactSummaryReducer,
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ACTIONS_CONTACTS_SUMMARY.START_FETCH });
      const response = await contactSummaryService.getContactsSummary();
      // TODO: define what to do in case of error
      dispatch({ type: ACTIONS_CONTACTS_SUMMARY.FINISH_FETCH, payload: response.value });
    };

    fetchData();
  }, [contactSummaryService]);

  return (
    <>
      <div className="dp-dashboard-title">
        <DashboardIconSubTitle title="dashboard.contacts.section_name" iconClass="subscribers" />
        <DashboardIconLink linkTitle="dashboard.contacts.link_title" link="#" />
      </div>
      <KpiGroup loading={loading}>
        {kpis.map((kpi) => (
          <Kpi key={kpi.id} {...kpi} />
        ))}
      </KpiGroup>
    </>
  );
});
