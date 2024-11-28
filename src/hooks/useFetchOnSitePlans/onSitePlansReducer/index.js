export const INITIAL_STATE_ONSITE_PLANS = {
  onSitePlans: [],
  onSitePlansValues: [],
  selectedPlanIndex: 0,
  selectedPlan: null,
  loading: true,
  hasError: false,
  cheapestOnSitePlan: null,
};

export const ONSITE_PLANS_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  RECEIVE_ONSITE_PLANS: 'RECEIVE_ONSITE_PLANS',
  SELECT_PLAN: 'SELECT_PLAN',
  FETCH_FAILED: 'FETCH_FAILED',
};

export const onSitePlansReducer = (state, action) => {
  switch (action.type) {
    case ONSITE_PLANS_ACTIONS.FETCHING_STARTED:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case ONSITE_PLANS_ACTIONS.RECEIVE_ONSITE_PLANS:
      const { onSitePlans, customOnSitePlans, currentOnSitePlan } = action.payload;

      const plans = [{ printQty: 0 }, ...onSitePlans];
      const plan = plans.filter((plan) => plan.printQty === currentOnSitePlan?.printQty)[0];
      const index = plans.indexOf(plan);

      var filterValues = onSitePlans.filter((cp) => cp.active !== false).map((cp) => cp.printQty);
      var cheapestOnSitePlan = onSitePlans?.reduce((previous, current) => {
        return current.fee < previous.fee ? current : previous;
      });

      return {
        ...state,
        loading: false,
        onSitePlans: plans,
        onSitePlansValues: [0, ...filterValues],
        selectedPlan: plan,
        selectedPlanIndex: index,
        customOnSitePlans: customOnSitePlans,
        cheapestOnSitePlan: cheapestOnSitePlan,
      };
    case ONSITE_PLANS_ACTIONS.SELECT_PLAN:
      const { payload: selectedPlanIndex } = action;

      return {
        ...state,
        selectedPlanIndex,
        selectedPlan: state.onSitePlans[selectedPlanIndex],
      };
    case ONSITE_PLANS_ACTIONS.FETCH_FAILED:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
