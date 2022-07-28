import React, { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
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
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ACTIONS_CAMPAIGNS_SUMMARY.START_FETCH });
      const response = await campaignSummaryService.getCampaignsSummary();
      // TODO: define what to do in case of error
      dispatch({ type: ACTIONS_CAMPAIGNS_SUMMARY.FINISH_FETCH, payload: response.value });
    };

    fetchData();
  }, [campaignSummaryService]);

  //   TODO: move logic to the service of campaigns
  const showOverlay = kpis[0]?.kpiValue === 0;

  return (
    <>
      <div className="dp-dashboard-title">
        <DashboardIconSubTitle title="dashboard.campaigns.section_name" iconClass="deliveries" />
        <DashboardIconLink
          linkTitle="dashboard.campaigns.link_title"
          link={_('dashboard.campaigns.link_title_url')}
          id="dashboard-sentCampaigns"
        />
      </div>
      <KpiGroup
        loading={loading}
        disabled={showOverlay}
        overlay={<FormattedMessageMarkdown id="dashboard.campaigns.overlayMessage" />}
      >
        {kpis.map((kpi) => (
          <Kpi key={kpi.id} {...kpi} />
        ))}
      </KpiGroup>
    </>
  );
});
