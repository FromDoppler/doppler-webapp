import { ONSITE_PLANS_ACTIONS, INITIAL_STATE_ONSITE_PLANS, onSitePlansReducer } from '.';

describe('onSitePlansReducer', () => {
  it(`${ONSITE_PLANS_ACTIONS.FETCHING_STARTED} action`, () => {
    // Arrange
    const action = { type: ONSITE_PLANS_ACTIONS.FETCHING_STARTED };

    // Act
    const newState = onSitePlansReducer(INITIAL_STATE_ONSITE_PLANS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_ONSITE_PLANS,
    });
  });

  it(`${ONSITE_PLANS_ACTIONS.RECEIVE_ONSITE_PLANS} action`, () => {
    // Arrange
    const currentOnSitePlan = {
      printQty: 0,
    };

    const onSitePlans = [
      {
        planId: 1,
        printQty: 500,
        fee: 25,
      },
      {
        planId: 2,
        printQty: 1000,
        fee: 50,
      },
    ];
    const action = {
      type: ONSITE_PLANS_ACTIONS.RECEIVE_ONSITE_PLANS,
      payload: {
        onSitePlans,
        currentOnSitePlan,
      },
    };

    // Act
    const newState = onSitePlansReducer(INITIAL_STATE_ONSITE_PLANS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_ONSITE_PLANS,
      loading: false,
      onSitePlans: [{ printQty: 0 }, ...onSitePlans],
      onSitePlansValues: [0, 500, 1000],
      selectedPlan: { printQty: 0 },
      cheapestOnSitePlan: {
        planId: 1,
        printQty: 500,
        fee: 25,
      },
    });
  });

  it(`${ONSITE_PLANS_ACTIONS.SELECT_PLAN} action`, () => {
    // Arrange
    const selectedPlanIndex = 1;
    const onSitePlans = [
      {
        planId: 1,
        printQty: 500,
      },
      {
        planId: 2,
        printQty: 1000,
      },
    ];
    const initialState = {
      ...INITIAL_STATE_ONSITE_PLANS,
      onSitePlans,
    };
    const action = {
      type: ONSITE_PLANS_ACTIONS.SELECT_PLAN,
      payload: selectedPlanIndex,
    };

    // Act
    const newState = onSitePlansReducer(initialState, action);

    // Assert
    expect(newState).toEqual({
      ...initialState,
      selectedPlan: onSitePlans[selectedPlanIndex],
      selectedPlanIndex,
    });
  });

  it(`${ONSITE_PLANS_ACTIONS.FETCH_FAILED} action`, () => {
    // Arrange
    const action = { type: ONSITE_PLANS_ACTIONS.FETCH_FAILED };

    // Act
    const newState = onSitePlansReducer(INITIAL_STATE_ONSITE_PLANS, action);

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
    const newState = onSitePlansReducer(INITIAL_STATE_ONSITE_PLANS, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_ONSITE_PLANS);
  });
});
