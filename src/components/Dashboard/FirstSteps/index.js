import React, { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import useTimeout from '../../../hooks/useTimeout';
import { Loading } from '../../Loading/Loading';
import { ActionBox } from './ActionBox';
import { Notification } from './Notification';
import {
  firstStepsFake,
  firstStepsReducer,
  FIRST_STEPS_ACTIONS,
  INITIAL_STATE_FIRST_STEPS,
} from './reducers/firstStepsReducer';

export const FirstSteps = () => {
  const [{ firstStepsData, loading }, dispatch] = useReducer(
    firstStepsReducer,
    INITIAL_STATE_FIRST_STEPS,
  );
  const createTimeout = useTimeout();
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: FIRST_STEPS_ACTIONS.FETCHING_STARTED });
      const data = await new Promise((resolve) => {
        createTimeout(() => resolve(firstStepsFake), 2000);
      });
      dispatch({ type: FIRST_STEPS_ACTIONS.RECEIVE_FIRST_STEPS, payload: data });
    };

    fetchData();
  }, [createTimeout]);

  const { firstSteps, notifications } = firstStepsData;

  return (
    <>
      {loading && <Loading />}
      <h2 className="dp-title-section-step">
        <span className="dp-icon-steps" />
        {_('dashboard.first_steps.section_name')}
      </h2>
      {notifications.map((notification, index) => (
        <Notification key={index} {...notification} />
      ))}
      {firstSteps.map((firstStep, index) => (
        <ActionBox key={index} {...firstStep} />
      ))}
    </>
  );
};
