import React, { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import { fakeCampaignsSummary } from '../../../services/reports/index.double';
import { UnexpectedError } from '../../shared/UnexpectedError';
import { Kpi } from '../Kpis/Kpi';
import { DashboardIconLink, DashboardIconSubTitle, KpiGroup } from '../Kpis/KpiGroup';
import { OverlaySection } from '../OverlaySection';
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
  const [{ loading, hasError, kpis }, dispatch] = useReducer(
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
      if (response.success) {
        dispatch({ type: ACTIONS_CAMPAIGNS_SUMMARY.FINISH_FETCH, payload: response.value });
      } else {
        dispatch({ type: ACTIONS_CAMPAIGNS_SUMMARY.FAIL_FETCH });
      }
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
      {!hasError ? (
        <KpiGroup
          loading={loading}
          disabled={showOverlay}
          overlay={
            <OverlaySection
              messageKey="dashboard.campaigns.overlayMessage"
              textLinkKey="dashboard.campaigns.overlayMessageButton"
              urlKey="dashboard.first_steps.has_campaings_created_url"
            />
          }
        >
          {kpis.map((kpi) => (
            <Kpi key={kpi.id} {...kpi} />
          ))}
        </KpiGroup>
      ) : (
        <UnexpectedError msgId="common.something_wrong" />
      )}
    </>
  );
});
