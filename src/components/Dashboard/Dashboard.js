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

export const Dashboard = InjectAppServices(
  ({ dependencies: { appSessionRef, systemUsageSummary, dopplerSystemUsageApiClient } }) => {
    const [{ firstStepsData, hasError, loading }, dispatch] = useReducer(
      firstStepsReducer,
      INITIAL_STATE_FIRST_STEPS,
      initFirstStepsReducer,
    );
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
                <FirstSteps
                  hasError={hasError}
                  loading={loading}
                  firstSteps={firstStepsData.firstSteps}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
