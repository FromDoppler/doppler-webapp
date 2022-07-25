import React, { useReducer, useEffect, useState } from 'react';
import { Loading } from '../Loading/Loading';
import {
  INITIAL_STATE,
  validateMaxSubscribersFormReducer,
  VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS,
} from './reducers/validateMaxSubscribersFormReducer';
import { ValidateMaxSubscribersForm } from './ValidateMaxSubscribersForm';
import { InjectAppServices } from '../../services/pure-di';
import { UnexpectedError } from '../Plans/PlanCalculator/UnexpectedError';
import { ValidateMaxSubscribersConfirmation } from './ValidateMaxSubscribersConfirm';

const ValidateSubscribers = ({
  dependencies: { dopplerLegacyClient },
  handleClose,
  setNextAlert,
}) => {
  const [{ loading, hasError, validationFormData }, dispatch] = useReducer(
    validateMaxSubscribersFormReducer,
    INITIAL_STATE,
  );

  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const isSuccess = await dopplerLegacyClient.sendMaxSubscribersData(validationFormData);
    if (isSuccess) {
      setSuccess(isSuccess);
      setNextAlert();
    }
    return isSuccess;
  };

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

  if (success) {
    return <ValidateMaxSubscribersConfirmation handleClose={handleClose} />;
  }

  return (
    <ValidateMaxSubscribersForm
      validationFormData={validationFormData}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
    />
  );
};

export default InjectAppServices(ValidateSubscribers);
