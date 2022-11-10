export const INITIAL_STATE_COMPLETE_STEPS = {
  updated: false,
  loading: false,
  hasError: false,
};

export const COMPLETE_STEPS_ACTIONS = {
  START_UPDATE: 'START_UPDATE',
  FINISH_UPDATE: 'FINISH_UPDATE',
  FAIL_UPDATE: 'FAIL_UPDATE',
};

export const completeStepsReducer = (state, action) => {
  switch (action.type) {
    case COMPLETE_STEPS_ACTIONS.START_UPDATE:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case COMPLETE_STEPS_ACTIONS.FINISH_UPDATE:
      return {
        updated: true,
        loading: false,
        hasError: false,
      };
    case COMPLETE_STEPS_ACTIONS.FAIL_UPDATE:
      return {
        updated: false,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
