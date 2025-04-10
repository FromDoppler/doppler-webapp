import {
  INITIAL_STATE_ONSITE_PLANS,
  ADDON_PLANS_ACTIONS,
  INITIAL_STATE_ADDON_PLANS,
  addOnPlansReducer,
} from '.';

describe('addOnPlansReducer', () => {
  it(`${ADDON_PLANS_ACTIONS.FETCHING_STARTED} action`, () => {
    // Arrange
    const action = { type: ADDON_PLANS_ACTIONS.FETCHING_STARTED };

    // Act
    const newState = addOnPlansReducer(INITIAL_STATE_ADDON_PLANS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_ADDON_PLANS,
    });
  });

  it(`${ADDON_PLANS_ACTIONS.RECEIVE_ADDON_PLANS} action`, () => {
    // Arrange
    const currentAddOnPlan = {
      quantity: 0,
    };

    const addOnPlans = [
      {
        planId: 1,
        quantity: 500,
        fee: 25,
      },
      {
        planId: 2,
        quantity: 1000,
        fee: 50,
      },
    ];
    const action = {
      type: ADDON_PLANS_ACTIONS.RECEIVE_ADDON_PLANS,
      payload: {
        addOnPlans,
        currentAddOnPlan,
      },
    };

    // Act
    const newState = addOnPlansReducer(INITIAL_STATE_ADDON_PLANS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_ADDON_PLANS,
      loading: false,
      addOnPlans: [{ quantity: 0 }, ...addOnPlans],
      addOnPlansValues: [0, 500, 1000],
      selectedPlan: { quantity: 0 },
      cheapestAddOnPlan: {
        planId: 1,
        quantity: 500,
        fee: 25,
      },
    });
  });

  it(`${ADDON_PLANS_ACTIONS.SELECT_PLAN} action`, () => {
    // Arrange
    const selectedPlanIndex = 1;
    const addOnPlans = [
      {
        planId: 1,
        quantity: 500,
      },
      {
        planId: 2,
        quantity: 1000,
      },
    ];
    const initialState = {
      ...INITIAL_STATE_ADDON_PLANS,
      addOnPlans,
    };
    const action = {
      type: ADDON_PLANS_ACTIONS.SELECT_PLAN,
      payload: selectedPlanIndex,
    };

    // Act
    const newState = addOnPlansReducer(initialState, action);

    // Assert
    expect(newState).toEqual({
      ...initialState,
      selectedPlan: addOnPlans[selectedPlanIndex],
      selectedPlanIndex,
    });
  });

  it(`${ADDON_PLANS_ACTIONS.FETCH_FAILED} action`, () => {
    // Arrange
    const action = { type: ADDON_PLANS_ACTIONS.FETCH_FAILED };

    // Act
    const newState = addOnPlansReducer(INITIAL_STATE_ONSITE_PLANS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_ONSITE_PLANS,
      loading: false,
      hasError: true,
    });
  });

  it('should return initialState when the action is not defined', () => {
    // Arrange
    const action = {
      type: 'my-action',
    };

    // Act
    const newState = addOnPlansReducer(INITIAL_STATE_ADDON_PLANS, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_ADDON_PLANS);
  });
});
