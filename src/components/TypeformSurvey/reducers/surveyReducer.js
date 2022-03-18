export const INITIAL_STATE_SURVEY = {
  surveyFormCompleted: true,
  loading: false,
  hasError: false,
};

export const SURVEY_ACTIONS = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const surveyReducer = (state, action) => {
  switch (action.type) {
    case SURVEY_ACTIONS.START_FETCH:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case SURVEY_ACTIONS.FINISH_FETCH:
      const { payload } = action;

      return {
        ...state,
        surveyFormCompleted: payload.surveyFormCompleted,
        loading: false,
        hasError: false,
      };
    case SURVEY_ACTIONS.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
