import React, { useEffect, useReducer } from 'react';
import useTimeout from '../../../hooks/useTimeout';
import { Kpi } from '../Kpis/Kpi';
import { DashboardIconLink, DashboardIconSubTitle, KpiGroup } from '../Kpis/KpiGroup';
import {
  ACTIONS_CONTACTS_SUMMARY,
  contactSummaryReducer,
  initContactSummaryReducer,
  mapContactSummary,
} from './reducers/contactSummaryReducer';

export const fakeContactsSummary = {
  totalSubscribers: 21.458,
  newSubscribers: 943,
  removedSubscribers: 32,
};

export const INITIAL_STATE_CONTACTS_SUMMARY = {
  loading: false,
  hasError: false,
  kpis: fakeContactsSummary,
};

export const ContactSummary = () => {
  const [{ loading, kpis }, dispatch] = useReducer(
    contactSummaryReducer,
    INITIAL_STATE_CONTACTS_SUMMARY,
    initContactSummaryReducer,
  );
  const createTimeout = useTimeout();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ACTIONS_CONTACTS_SUMMARY.START_FETCH });
      const data = await new Promise((resolve) => {
        createTimeout(() => {
          resolve(fakeContactsSummary);
        }, 2000);
      });
      const mappedData = mapContactSummary(data);
      dispatch({ type: ACTIONS_CONTACTS_SUMMARY.FINISH_FETCH, payload: mappedData });
    };

    fetchData();
  }, [createTimeout]);

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
};
