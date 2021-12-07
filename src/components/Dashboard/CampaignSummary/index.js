import React, { useEffect, useReducer } from 'react';
import useTimeout from '../../../hooks/useTimeout';
import { Kpi } from '../Kpis/Kpi';
import { DashboardIconLink, DashboardIconSubTitle, KpiGroup } from '../Kpis/KpiGroup';
import {
  ACTIONS_CAMPAIGNS_SUMMARY,
  campaignSummaryReducer,
  initCampaignSummaryReducer,
  mapCampaignsSummary,
} from './reducers/campaignSummaryReducer';

export const fakeCampaignsSummary = {
  totalSentEmails: 21.458,
  totalOpenClicks: 57,
  clickThroughRate: 15,
};

export const INITIAL_STATE_CAMPAIGNS_SUMMARY = {
  loading: false,
  hasError: false,
  kpis: fakeCampaignsSummary,
};

export const CampaignSummary = () => {
  const [{ loading, kpis }, dispatch] = useReducer(
    campaignSummaryReducer,
    INITIAL_STATE_CAMPAIGNS_SUMMARY,
    initCampaignSummaryReducer,
  );
  const createTimeout = useTimeout();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ACTIONS_CAMPAIGNS_SUMMARY.START_FETCH });
      const data = await new Promise((resolve) => {
        createTimeout(() => {
          resolve(fakeCampaignsSummary);
        }, 2000);
      });
      const mappedData = mapCampaignsSummary(data);
      dispatch({ type: ACTIONS_CAMPAIGNS_SUMMARY.FINISH_FETCH, payload: mappedData });
    };

    fetchData();
  }, [createTimeout]);

  return (
    <>
      <div className="dp-dashboard-title">
        <DashboardIconSubTitle title="dashboard.campaigns.section_name" iconClass="deliveries" />
        <DashboardIconLink linkTitle="dashboard.campaigns.link_title" link="#" />
      </div>
      <KpiGroup loading={loading}>
        {kpis.map((kpi) => (
          <Kpi key={kpi.id} {...kpi} />
        ))}
      </KpiGroup>
    </>
  );
};
