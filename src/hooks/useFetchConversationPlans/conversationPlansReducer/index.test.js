import {
  CONVERSATION_PLANS_ACTIONS,
  INITIAL_STATE_CONVERSATION_PLANS,
  conversationPlansReducer,
} from '.';

describe('conversationPlansReducer', () => {
  it(`${CONVERSATION_PLANS_ACTIONS.FETCHING_STARTED} action`, () => {
    // Arrange
    const action = { type: CONVERSATION_PLANS_ACTIONS.FETCHING_STARTED };

    // Act
    const newState = conversationPlansReducer(INITIAL_STATE_CONVERSATION_PLANS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_CONVERSATION_PLANS,
    });
  });

  it(`${CONVERSATION_PLANS_ACTIONS.RECEIVE_CONVERSATION_PLANS} action`, () => {
    // Arrange
    const conversationPlans = [
      {
        planId: 1,
        conversationsQty: 500,
        agents: 1,
        channels: 4,
      },
      {
        planId: 2,
        conversationsQty: 1000,
        agents: 2,
        channels: 3,
      },
    ];
    const action = {
      type: CONVERSATION_PLANS_ACTIONS.RECEIVE_CONVERSATION_PLANS,
      payload: conversationPlans,
    };

    // Act
    const newState = conversationPlansReducer(INITIAL_STATE_CONVERSATION_PLANS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_CONVERSATION_PLANS,
      loading: false,
      conversationPlans: [{}, ...conversationPlans],
      conversationPlansValues: [0, 500, 1000],
      selectedPlan: {},
    });
  });

  it(`${CONVERSATION_PLANS_ACTIONS.SELECT_PLAN} action`, () => {
    // Arrange
    const selectedPlanIndex = 1;
    const conversationPlans = [
      {
        planId: 1,
        conversationsQty: 500,
        agents: 1,
        channels: 4,
      },
      {
        planId: 2,
        conversationsQty: 1000,
        agents: 2,
        channels: 3,
      },
    ];
    const initialState = {
      ...INITIAL_STATE_CONVERSATION_PLANS,
      conversationPlans,
    };
    const action = {
      type: CONVERSATION_PLANS_ACTIONS.SELECT_PLAN,
      payload: selectedPlanIndex,
    };

    // Act
    const newState = conversationPlansReducer(initialState, action);

    // Assert
    expect(newState).toEqual({
      ...initialState,
      selectedPlan: conversationPlans[selectedPlanIndex],
      selectedPlanIndex,
    });
  });

  it(`${CONVERSATION_PLANS_ACTIONS.FETCH_FAILED} action`, () => {
    // Arrange
    const action = { type: CONVERSATION_PLANS_ACTIONS.FETCH_FAILED };

    // Act
    const newState = conversationPlansReducer(INITIAL_STATE_CONVERSATION_PLANS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_CONVERSATION_PLANS,
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
    const newState = conversationPlansReducer(INITIAL_STATE_CONVERSATION_PLANS, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_CONVERSATION_PLANS);
  });
});
