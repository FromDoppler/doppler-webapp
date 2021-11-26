import {
  firstStepsFake,
  firstStepsReducer,
  FIRST_STEPS_ACTIONS,
  INITIAL_STATE_FIRST_STEPS,
  orderItem,
} from './firstStepsReducer';

describe('firstStepsReducer', () => {
  it(`${FIRST_STEPS_ACTIONS.FETCHING_STARTED} action`, () => {
    // Arrange
    const action = { type: FIRST_STEPS_ACTIONS.FETCHING_STARTED };

    // Act
    const newState = firstStepsReducer(INITIAL_STATE_FIRST_STEPS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_FIRST_STEPS,
      loading: !INITIAL_STATE_FIRST_STEPS.loading,
    });
  });

  it(`${FIRST_STEPS_ACTIONS.RECEIVE_FIRST_STEPS} action`, () => {
    // Arrange
    const action = {
      type: FIRST_STEPS_ACTIONS.RECEIVE_FIRST_STEPS,
      payload: firstStepsFake,
    };

    // Act
    const newState = firstStepsReducer(INITIAL_STATE_FIRST_STEPS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_FIRST_STEPS,
      loading: false,
      firstStepsData: {
        ...firstStepsFake,
        firstSteps: firstStepsFake.firstSteps.sort(orderItem),
        notifications: firstStepsFake.notifications.sort(orderItem),
      },
    });
  });

  it(`${FIRST_STEPS_ACTIONS.FETCH_FAILED} action`, () => {
    // Arrange
    const action = { type: FIRST_STEPS_ACTIONS.FETCH_FAILED };

    // Act
    const newState = firstStepsReducer(INITIAL_STATE_FIRST_STEPS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_FIRST_STEPS,
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
    const newState = firstStepsReducer(INITIAL_STATE_FIRST_STEPS, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_FIRST_STEPS);
  });
});
