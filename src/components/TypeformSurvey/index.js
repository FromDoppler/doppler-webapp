import { PopupButton } from '@typeform/embed-react';
import React, { useEffect, useReducer } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { INITIAL_STATE_SURVEY, surveyReducer, SURVEY_ACTIONS } from './reducers/surveyReducer';

export const TypeformSurvey = InjectAppServices(
  ({ dependencies: { appSessionRef, surveyClient } }) => {
    const [{ surveyFormCompleted, loading }, dispatch] = useReducer(
      surveyReducer,
      INITIAL_STATE_SURVEY,
    );

    useEffect(() => {
      const fetchData = async () => {
        dispatch({ type: SURVEY_ACTIONS.START_FETCH });
        const response = await surveyClient.getSurveyFormStatus();
        if (response.success) {
          dispatch({
            type: SURVEY_ACTIONS.FINISH_FETCH,
            payload: { surveyFormCompleted: response.value },
          });
        } else {
          dispatch({ type: SURVEY_ACTIONS.FAIL_FETCH });
        }
      };

      fetchData();
    }, [surveyClient]);

    if (loading || surveyFormCompleted) {
      return <div data-testid="empty-fragment" />;
    }

    const { REACT_APP_TYPEFORMID_ES, REACT_APP_TYPEFORMID_EN } = process.env;
    const { lang, email, fullname } = appSessionRef.current.userData.user;
    const typeformId = lang === 'es' ? REACT_APP_TYPEFORMID_ES : REACT_APP_TYPEFORMID_EN;

    return (
      <PopupButton
        id={typeformId}
        open="load"
        size={100}
        hidden={{
          email: email,
          lastName: fullname,
        }}
        onReady={async () => {
          console.log('form ready');
          await surveyClient.setSurveyToCompleted();
        }}
      />
    );
  },
);
