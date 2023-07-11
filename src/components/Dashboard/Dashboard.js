import React, { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { InjectAppServices } from '../../services/pure-di';
import { CampaignSummary } from './CampaignSummary';
import { ContactSummary } from './ContactSummary';
import { FirstSteps } from './FirstSteps';
import { LearnWithDoppler } from './LearnWithDoppler';
import { Helmet } from 'react-helmet';
import { TypeformSurvey } from '../TypeformSurvey';
import {
  firstStepsReducer,
  FIRST_STEPS_ACTIONS,
  initFirstStepsReducer,
  INITIAL_STATE_FIRST_STEPS,
  mapSystemUsageSummary,
  UNKNOWN_STATUS,
} from './reducers/firstStepsReducer';
import { CompleteSteps } from './CompleteSteps';
import {
  completeStepsReducer,
  COMPLETE_STEPS_ACTIONS,
  INITIAL_STATE_COMPLETE_STEPS,
} from './reducers/completeStepsReducer';
import { QuickActions } from './QuickActions';
import { UnexpectedError } from '../shared/UnexpectedError';

export const Dashboard = InjectAppServices(
  ({ dependencies: { appSessionRef, systemUsageSummary, dopplerSystemUsageApiClient } }) => {
    const [{ firstStepsData, hasError, loading }, dispatch] = useReducer(
      firstStepsReducer,
      INITIAL_STATE_FIRST_STEPS,
      initFirstStepsReducer,
    );
    const [
      { updated, hasError: hasErrorCompleteSteps, loading: loadingCompleteSteps },
      dispatchCompleteSteps,
    ] = useReducer(completeStepsReducer, INITIAL_STATE_COMPLETE_STEPS);
    const userName = appSessionRef?.current.userData.user.fullname.split(' ')[0]; // Get firstname
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

    const { firstStepsClosedSince, completed } = firstStepsData;

    useEffect(() => {
      if (!firstStepsClosedSince && completed) {
        const updateData = async () => {
          dispatchCompleteSteps({ type: COMPLETE_STEPS_ACTIONS.START_UPDATE });
          const response = await dopplerSystemUsageApiClient.closeFirstSteps();
          if (response.success) {
            dispatchCompleteSteps({
              type: COMPLETE_STEPS_ACTIONS.FINISH_UPDATE,
            });
          } else {
            dispatchCompleteSteps({ type: COMPLETE_STEPS_ACTIONS.FAIL_UPDATE });
          }
        };

        setTimeout(async () => await updateData(), 5000);
      }
    }, [completed, firstStepsClosedSince, dopplerSystemUsageApiClient]);

    const showFirstStep = !firstStepsClosedSince && !updated;

    const { user } = appSessionRef.current.userData;

    return (
      <>
        <Helmet>
          <title>{_('dashboard.meta_title')}</title>
        </Helmet>
        <TypeformSurvey />
        <div className="dp-dashboard p-b-48">
          <header className="hero-banner">
            <div className="dp-container">
              <div className="dp-rowflex">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <h2>
                    ¡{_('dashboard.welcome_message')} {userName}!
                  </h2>
                </div>
                <div className="col-sm-12">
                  <FormattedMessageMarkdown id="dashboard.welcome_message_header" />
                </div>
              </div>
            </div>
          </header>
          <div className="dp-container">
            <div className="dp-rowflex">
              <div className="col-lg-8 col-md-12 m-b-24">
                <CampaignSummary />
                <ContactSummary />
                <LearnWithDoppler />
              </div>
              <div className="col-lg-4 col-sm-12">
                {showFirstStep ? (
                  <>
                    <FirstSteps
                      hasError={hasError}
                      loading={loading}
                      firstSteps={firstStepsData.firstSteps}
                    />
                    {completed && (
                      <>
                        <CompleteSteps loading={loadingCompleteSteps} />
                        {hasErrorCompleteSteps && (
                          <div className="m-t-6">
                            <UnexpectedError msgId="common.something_wrong" />
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <QuickActions
                    quickActions={user.sms?.smsEnabled ? QUICK_ACTIONS : filteredQuickActions}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

export const QUICK_ACTIONS = [
  {
    labelId: 'dashboard.quick_actions.make_campaign',
    linkId: 'dashboard.quick_actions.make_campaign_url',
    trackingId: `dashboard-crearCampania`,
  },
  {
    labelId: 'dashboard.quick_actions.make_contact_list',
    linkId: 'dashboard.quick_actions.make_contact_list_url',
    trackingId: `dashboard-armarListaContactos`,
  },
  {
    labelId: 'dashboard.quick_actions.launch_automation',
    linkId: 'dashboard.quick_actions.launch_automation_url',
    trackingId: `dashboard-lanzarAutomatizacion`,
  },
  {
    labelId: 'dashboard.quick_actions.send_sms',
    linkId: 'dashboard.quick_actions.send_sms_url',
    trackingId: `dashboard-enviarSmsMasivos`,
  },
  {
    labelId: 'dashboard.quick_actions.send_push_notification',
    linkId: 'dashboard.quick_actions.send_push_notification_url',
    trackingId: `dashboard-enviarNotificacionPush`,
  },
  {
    labelId: 'dashboard.quick_actions.create_form',
    linkId: 'dashboard.quick_actions.create_form_url',
    trackingId: `dashboard-crearFormulario`,
  },
];

export const filteredQuickActions = QUICK_ACTIONS.filter(
  (qa) => !['dashboard.quick_actions.send_sms'].includes(qa.labelId),
);
