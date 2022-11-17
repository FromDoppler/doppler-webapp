import React, { useEffect, useReducer } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { useIntl } from 'react-intl';
import { Loading } from '../../Loading/Loading';
import { ActionBox } from './ActionBox';
import {
  COMPLETED_STATUS,
  firstStepsReducer,
  FIRST_STEPS_ACTIONS,
  initFirstStepsReducer,
  INITIAL_STATE_FIRST_STEPS,
  PENDING_STATUS,
  UNKNOWN_STATUS,
} from './reducers/firstStepsReducer';
import { UnexpectedError } from '../../shared/UnexpectedError';

export const FirstSteps = InjectAppServices(
  ({ dependencies: { systemUsageSummary, dopplerSystemUsageApiClient } }) => {
    const [{ firstStepsData, hasError, loading }, dispatch] = useReducer(
      firstStepsReducer,
      INITIAL_STATE_FIRST_STEPS,
      initFirstStepsReducer,
    );

    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      // TODO: use getUserSystemUsage for the same purpose as getSystemUsageSummaryData
      // TODO: remove systemUsageSummary service
      const fetchData = async () => {
        dispatch({ type: FIRST_STEPS_ACTIONS.START_FETCH });
        const [systemUsageResponse, dopplerSystemUsageResponse] = await Promise.all([
          systemUsageSummary.getSystemUsageSummaryData(),
          dopplerSystemUsageApiClient.getUserSystemUsage(),
        ]);
        if (systemUsageResponse.success && dopplerSystemUsageResponse.success) {
          const dataMapped = mapSystemUsageSummary({
            ...systemUsageResponse.value,
            ...dopplerSystemUsageResponse.value,
          });
          dispatch({
            type: FIRST_STEPS_ACTIONS.FINISH_FETCH,
            payload: {
              ...dataMapped,
              firstSteps: dataMapped.firstSteps.filter(
                (firstStep) => firstStep.status !== UNKNOWN_STATUS,
              ),
            },
          });
        } else {
          dispatch({ type: FIRST_STEPS_ACTIONS.FAIL_FETCH });
        }
      };

      fetchData();
    }, [systemUsageSummary, dopplerSystemUsageApiClient]);

    const { firstSteps } = firstStepsData;

    return (
      <>
        {loading && <Loading />}
        <h2 className="dp-title-col-postcard">
          <span className="dp-icon-steps" />
          {_('dashboard.first_steps.section_name')}
        </h2>
        {!hasError ? (
          <ul className="dp-stepper">
            {firstSteps.map((firstStep, index) => (
              <li key={firstStep.titleId}>
                <ActionBox {...firstStep} />
              </li>
            ))}
          </ul>
        ) : (
          <UnexpectedError msgId="common.something_wrong" />
        )}
      </>
    );
  },
);

const isFirstStepsCompleted = (systemUsageSummary) => {
  const {
    hasListsCreated,
    hasCampaingsCreated,
    hasDomainsReady,
    hasCampaingsSent,
    reportsSectionLastVisit,
  } = systemUsageSummary;

  return (
    hasListsCreated === true &&
    hasCampaingsCreated === true &&
    hasDomainsReady === true &&
    hasCampaingsSent === true &&
    reportsSectionLastVisit
  );
};

const getListCreatedStep = (hasListsCreated) => ({
  status: hasListsCreated
    ? COMPLETED_STATUS
    : hasListsCreated === false
    ? PENDING_STATUS
    : UNKNOWN_STATUS,
  titleId: 'dashboard.first_steps.has_list_created_title',
  descriptionId: 'dashboard.first_steps.has_list_created_description_MD',
  textStep: 1,
  trackingId: 'dashboard-firstSteps-line1',
  link: 'dashboard.first_steps.has_list_created_url',
});

const getDomainsReadyStep = (hasDomainsReady) => ({
  status: hasDomainsReady
    ? COMPLETED_STATUS
    : hasDomainsReady === false
    ? PENDING_STATUS
    : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_domains_ready_title`,
  descriptionId: 'dashboard.first_steps.has_domains_ready_description_MD',
  textStep: 2,
  trackingId: 'dashboard-firstSteps-line2',
  link: 'dashboard.first_steps.has_domains_ready_url',
});

const getCampaingsCreatedAndSentStep = (hasCampaingsCreatedAndSent) => ({
  status: hasCampaingsCreatedAndSent
    ? COMPLETED_STATUS
    : hasCampaingsCreatedAndSent === false
    ? PENDING_STATUS
    : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_campaings_created_title`,
  descriptionId: 'dashboard.first_steps.has_campaings_created_description_MD',
  textStep: 3,
  trackingId: 'dashboard-firstSteps-line3',
  link: 'dashboard.first_steps.has_campaings_created_url',
});

const getCampaingsSentStep = (hasCampaingsSent, reportsSectionLastVisit) => ({
  status:
    hasCampaingsSent && reportsSectionLastVisit
      ? COMPLETED_STATUS
      : hasCampaingsSent === false || !reportsSectionLastVisit
      ? PENDING_STATUS
      : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_campaings_sent_title`,
  descriptionId: 'dashboard.first_steps.has_campaings_sent_description_MD',
  textStep: 4,
  trackingId: 'dashboard-firstSteps-line4',
  link: 'dashboard.first_steps.has_campaings_sent_url',
});

// TODO: move to service folder to get system usage summary
export const mapSystemUsageSummary = (systemUsageSummary) => {
  const {
    hasListsCreated,
    hasCampaingsCreated,
    hasDomainsReady,
    hasCampaingsSent,
    reportsSectionLastVisit,
  } = systemUsageSummary;

  return {
    completed: isFirstStepsCompleted(systemUsageSummary),
    firstSteps: [
      getListCreatedStep(hasListsCreated),
      getDomainsReadyStep(hasDomainsReady),
      getCampaingsCreatedAndSentStep(hasCampaingsCreated && hasCampaingsSent),
      getCampaingsSentStep(hasCampaingsSent, reportsSectionLastVisit),
    ],
  };
};
