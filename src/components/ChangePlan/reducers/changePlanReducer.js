export const CHANGE_PLAN_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  RECEIVE_PLAN: 'RECEIVE_PATHS',
};

export const changePlanReducer = (state, action) => {
  switch (action.type) {
    case CHANGE_PLAN_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: !state.loading,
      };
    case CHANGE_PLAN_ACTIONS.RECEIVE_PLAN:
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
