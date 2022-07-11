import React, { useReducer, useEffect } from 'react';
import { Loading } from '../Loading/Loading';
import {
  INITIAL_STATE,
  validateMaxSubscribersFormReducer,
  VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS,
} from './reducers/validateMaxSubscribersFormReducer';
import { InjectAppServices } from '../../services/pure-di';
import { UnexpectedError } from '../Plans/PlanCalculator/UnexpectedError';

const ValidateSubscribers = ({ dependencies: { dopplerLegacyClient } }) => {
  const [{ loading, hasError, validationFormData }, dispatch] = useReducer(
    validateMaxSubscribersFormReducer,
    INITIAL_STATE,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.START_FETCH });
        const response = await dopplerLegacyClient.getMaxSubscribersData();
        dispatch({ type: VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.FINISH_FETCH, payload: response });
      } catch (error) {
        dispatch({ type: VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.FAIL_FETCH });
      }
    };
    fetchData();
  }, [dopplerLegacyClient]);

  if (loading) {
    return <Loading />;
  }

  if (hasError) {
    return <UnexpectedError />;
  }

  return <></>;
};

export default InjectAppServices(ValidateSubscribers);
