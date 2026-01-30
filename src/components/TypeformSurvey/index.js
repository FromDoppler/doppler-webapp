import { PopupButton } from '@typeform/embed-react';
import React, { useEffect, useReducer, useRef } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { INITIAL_STATE_SURVEY, surveyReducer, SURVEY_ACTIONS } from './reducers/surveyReducer';

export const TypeformSurvey = InjectAppServices(
  ({ dependencies: { appSessionRef, dopplerLegacyClient }, setIsClosed, isClosed }) => {
    const [{ surveyFormCompleted, loading }, dispatch] = useReducer(
      surveyReducer,
      INITIAL_STATE_SURVEY,
    );

    // Tracks when the user submitted the form
    const submittedRef = useRef(false);

    // Prevent firing Userpilot twice
    const userpilotFiredRef = useRef(false);

    // Store timeout id so we can cancel it if user closes early
    const closeTimeoutRef = useRef(null);

    const clearCloseTimeout = () => {
      if (!closeTimeoutRef.current) return;
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    };

    const fireUserpilotOnce = () => {
      if (!submittedRef.current) return;
      if (userpilotFiredRef.current) return;

      userpilotFiredRef.current = true;
      // Fire Userpilot event
      dopplerLegacyClient.FireSurveyFormCompletedEvent();
    };

    const closeAndFireUserpilotEvent = () => {
      setIsClosed(true);
      // Defer so React can unmount the Typeform popup before opening a new modal
      setTimeout(() => { fireUserpilotOnce(); }, 0);
    };

    useEffect(() => {
      const fetchData = async () => {
        dispatch({ type: SURVEY_ACTIONS.START_FETCH });
        const response = await dopplerLegacyClient.getSurveyFormStatus();
        if (response.success) {
          dispatch({ type: SURVEY_ACTIONS.FINISH_FETCH, payload: response.value });
        } else {
          dispatch({ type: SURVEY_ACTIONS.FAIL_FETCH });
        }
      };

      fetchData();

      // Cleanup pending timeouts when unmounting
      return () => {
        clearCloseTimeout();
      };
    }, [dopplerLegacyClient]);

    const { isFreeAccount: isTrial } = appSessionRef.current.userData.user.plan;

    if (loading || surveyFormCompleted || !isTrial || isClosed) {
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
        onSubmit={async () => {
          // Only mark the survey as completed in the backend (it doesn't fire the userpilot event)
          await dopplerLegacyClient.setSurveyToCompleted();

          // Mark that the user submitted (so close behavior can trigger Userpilot)
          submittedRef.current = true;

          // Give the user time to read the end screen
          const READING_TIME_MS = 9000;

          // Ensure no previous timer is running
          clearCloseTimeout();

          closeTimeoutRef.current = window.setTimeout(() => {
            closeTimeoutRef.current = null;
            closeAndFireUserpilotEvent();
          }, READING_TIME_MS);
        }}
        onClose={() => {
          // If the user closes before the reading timeout ends, cancel it
          clearCloseTimeout();

          if (submittedRef.current) {
            // Close and track if submitted
            closeAndFireUserpilotEvent();
          } else {
            // Close without tracking
            setIsClosed(true);
          }
        }}
      />
    );
  },
);
