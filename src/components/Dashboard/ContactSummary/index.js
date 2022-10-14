import React, { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import { fakeContactsSummary } from '../../../services/reports/index.double';
import { UnexpectedError } from '../../shared/UnexpectedError';
import { Kpi } from '../Kpis/Kpi';
import { DashboardIconLink, DashboardIconSubTitle, KpiGroup } from '../Kpis/KpiGroup';
import { OverlaySection } from '../OverlaySection';
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
  const [{ loading, hasError, kpis }, dispatch] = useReducer(
    contactSummaryReducer,
    INITIAL_STATE_CONTACTS_SUMMARY,
    initContactSummaryReducer,
  );
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ACTIONS_CONTACTS_SUMMARY.START_FETCH });
      const response = await contactSummaryService.getContactsSummary();
      if (response.success) {
        dispatch({ type: ACTIONS_CONTACTS_SUMMARY.FINISH_FETCH, payload: response.value });
      } else {
        dispatch({ type: ACTIONS_CONTACTS_SUMMARY.FAIL_FETCH });
      }
    };

    fetchData();
  }, [contactSummaryService]);

  const showOverlay = kpis[0]?.kpiValue === 0;

  return (
    <>
      <div className="dp-dashboard-title">
        <DashboardIconSubTitle title="dashboard.contacts.section_name" iconClass="subscribers" />
        <DashboardIconLink
          linkTitle="dashboard.contacts.link_title"
          link={_('dashboard.contacts.link_title_url')}
          id="dashboard-masterConctacts"
        />
      </div>
      {!hasError ? (
        <KpiGroup
          loading={loading}
          disabled={showOverlay}
          overlay={
            <OverlaySection
              messageKey="dashboard.contacts.overlayMessage"
              textLinkKey="dashboard.contacts.overlayMessageButton"
              urlKey="dashboard.first_steps.has_list_created_url"
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
