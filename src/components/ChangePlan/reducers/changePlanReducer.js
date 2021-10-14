export const CHANGE_PLAN_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  RECEIVE_PLANS: 'RECEIVE_PATHS',
};

export const changePlanReducer = (state, action) => {
  switch (action.type) {
    case CHANGE_PLAN_ACTIONS.FETCHING_STARTED:
      return {
        ...state,
        loading: true,
      };
    case CHANGE_PLAN_ACTIONS.RECEIVE_PLANS:
      const { pathList, currentPlan } = action.payload;
      return {
        ...state,
        loading: false,
        pathList,
        currentPlan,
      };
    default:
      return state;
  }
};
