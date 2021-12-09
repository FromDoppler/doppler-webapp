import React, { useEffect, useReducer } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { fakeCampaignsSummary } from '../../../services/reports/index.double';
import { Kpi } from '../Kpis/Kpi';
import { DashboardIconLink, DashboardIconSubTitle, KpiGroup } from '../Kpis/KpiGroup';
import {
  ACTIONS_CAMPAIGNS_SUMMARY,
  campaignSummaryReducer,
  initCampaignSummaryReducer,
} from './reducers/campaignSummaryReducer';

export const INITIAL_STATE_CAMPAIGNS_SUMMARY = {
  loading: false,
  hasError: false,
  kpis: fakeCampaignsSummary,
};

export const CampaignSummary = InjectAppServices(({ dependencies: { campaignSummaryService } }) => {
  const [{ loading, kpis }, dispatch] = useReducer(
    campaignSummaryReducer,
    INITIAL_STATE_CAMPAIGNS_SUMMARY,
    initCampaignSummaryReducer,
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ACTIONS_CAMPAIGNS_SUMMARY.START_FETCH });
      const response = await campaignSummaryService.getCampaignsSummary();
      // TODO: define what to do in case of error
      dispatch({ type: ACTIONS_CAMPAIGNS_SUMMARY.FINISH_FETCH, payload: response.value });
    };

    fetchData();
  }, [campaignSummaryService]);

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
});
