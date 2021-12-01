import React, { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import useTimeout from '../../../hooks/useTimeout';
import { Loading } from '../../Loading/Loading';
import { ActionBox } from './ActionBox';
import { Notification } from './Notification';
import {
  COMPLETED_STATUS,
  firstStepsFake,
  firstStepsReducer,
  FIRST_STEPS_ACTIONS,
  initFirstStepsReducer,
  INITIAL_STATE_FIRST_STEPS,
  PENDING_STATUS,
  UNKNOWN_STATUS,
  WARNING_STATUS,
} from './reducers/firstStepsReducer';
import classNames from 'classnames';
import styled from 'styled-components';

export const FirstStepsStyled = styled.div`
  position: relative;
`;

export const FirstSteps = () => {
  const [{ firstStepsData, loading }, dispatch] = useReducer(
    firstStepsReducer,
    INITIAL_STATE_FIRST_STEPS,
    initFirstStepsReducer,
  );
  const createTimeout = useTimeout();
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: FIRST_STEPS_ACTIONS.FETCHING_STARTED });
      const data = await new Promise((resolve) => {
        createTimeout(() => resolve(firstStepsFake), 4000);
      });
      const dataMapped = mapSystemUsageSummary(data);
      dispatch({
        type: FIRST_STEPS_ACTIONS.RECEIVE_FIRST_STEPS,
        payload: {
          ...dataMapped,
          firstSteps: dataMapped.firstSteps.filter(
            (firstStep) => firstStep.status !== UNKNOWN_STATUS,
          ),
        },
      });
    };

    fetchData();
  }, [createTimeout]);

  const { firstSteps, notifications } = firstStepsData;

  return (
    <FirstStepsStyled
      style={{ position: 'relative' }}
      className={classNames({
        'p-l-12 p-t-12 p-r-12 p-b-12': loading,
      })}
    >
      {loading && <Loading />}
      <h2 className="dp-title-col-postcard">
        <span className="dp-icon-steps" />
        {_('dashboard.first_steps.section_name')}
      </h2>
      {notifications.map((notification, index) => (
        <Notification key={index} {...notification} />
      ))}
      {firstSteps.map((firstStep, index) => (
        <ActionBox key={index} {...firstStep} />
      ))}
    </FirstStepsStyled>
  );
};

const isFirstStepsCompleted = (systemUsageSummary) => {
  const { hasListsCreated, hasCampaingsCreated, hasDomainsReady, hasCampaingsSent } =
    systemUsageSummary;

  return (
    hasListsCreated === true &&
    hasCampaingsCreated === true &&
    hasDomainsReady === true &&
    hasCampaingsSent === true
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
});

const getDomainsReadyStep = (hasDomainsReady) => ({
  status: hasDomainsReady
    ? COMPLETED_STATUS
    : hasDomainsReady === false
    ? WARNING_STATUS
    : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_domains_ready_title`,
  descriptionId: 'dashboard.first_steps.has_domains_ready_description_MD',
});

const getCampaingsCreatedStep = (hasCampaingsCreated) => ({
  status: hasCampaingsCreated
    ? COMPLETED_STATUS
    : hasCampaingsCreated === false
    ? PENDING_STATUS
    : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_campaings_created_title`,
  descriptionId: 'dashboard.first_steps.has_campaings_created_description_MD',
  textStep: 2,
});

const getCampaingsSentStep = (hasCampaingsSent) => ({
  status: hasCampaingsSent
    ? COMPLETED_STATUS
    : hasCampaingsSent === false
    ? PENDING_STATUS
    : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_campaings_sent_title`,
  descriptionId: 'dashboard.first_steps.has_campaings_sent_description_MD',
  textStep: 3,
});

// TODO: move to service folder to get system usage summary
export const mapSystemUsageSummary = (systemUsageSummary) => {
  const { hasListsCreated, hasCampaingsCreated, hasDomainsReady, hasCampaingsSent } =
    systemUsageSummary;

  return {
    completed: isFirstStepsCompleted(systemUsageSummary),
    firstSteps: [
      getListCreatedStep(hasListsCreated),
      getDomainsReadyStep(hasDomainsReady),
      getCampaingsCreatedStep(hasCampaingsCreated),
      getCampaingsSentStep(hasCampaingsSent),
    ],
    notifications: [
      {
        iconClass: 'dp-postcard--welcom',
        titleId: 'dashboard.first_steps.welcome_title',
        descriptionId: 'dashboard.first_steps.welcome_description_MD',
      },
    ],
  };
};
