export const INITIAL_STATE_ADDON_PLANS = {
  addOnPlans: [],
  addOnPlansValues: [],
  selectedPlanIndex: 0,
  selectedPlan: null,
  loading: true,
  hasError: false,
  cheapestAddOnPlan: null,
};

export const ADDON_PLANS_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  RECEIVE_ADDON_PLANS: 'RECEIVE_ADDON_PLANS',
  SELECT_PLAN: 'SELECT_PLAN',
  FETCH_FAILED: 'FETCH_FAILED',
};

export const addOnPlansReducer = (state, action) => {
  switch (action.type) {
    case ADDON_PLANS_ACTIONS.FETCHING_STARTED:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case ADDON_PLANS_ACTIONS.RECEIVE_ADDON_PLANS:
      const { addOnPlans, customAddOnPlans, currentAddOnPlan } = action.payload;

      const plans = [{ quantity: 0 }, ...addOnPlans];
      const plan = plans.filter((plan) => plan.quantity === currentAddOnPlan?.quantity)[0];
      const index = plans.indexOf(plan);

      var filterValues = addOnPlans.filter((ap) => ap.active !== false).map((ap) => ap.quantity);
      var cheapestAddOnPlan = addOnPlans?.reduce((previous, current) => {
        return current.fee < previous.fee ? current : previous;
      });

      return {
        ...state,
        loading: false,
        addOnPlans: plans,
        addOnPlansValues: [0, ...filterValues],
        selectedPlan: plan,
        selectedPlanIndex: index,
        customAddOnPlans: customAddOnPlans,
        cheapestAddOnPlan: cheapestAddOnPlan,
      };
    case ADDON_PLANS_ACTIONS.SELECT_PLAN:
      const { payload: selectedPlanIndex } = action;

      return {
        ...state,
        selectedPlanIndex,
        selectedPlan: state.addOnPlans[selectedPlanIndex],
      };
    case ADDON_PLANS_ACTIONS.FETCH_FAILED:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
