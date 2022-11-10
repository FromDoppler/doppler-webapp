import {
  completeStepsReducer,
  COMPLETE_STEPS_ACTIONS,
  INITIAL_STATE_COMPLETE_STEPS,
} from './completeStepsReducer';

describe('completeStepsReducer', () => {
  it(`${COMPLETE_STEPS_ACTIONS.START_UPDATE} action`, () => {
    // Arrange
    const action = { type: COMPLETE_STEPS_ACTIONS.START_UPDATE };

    // Act
    const newState = completeStepsReducer(INITIAL_STATE_COMPLETE_STEPS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_COMPLETE_STEPS,
      loading: !INITIAL_STATE_COMPLETE_STEPS.loading,
      hasError: false,
    });
  });

  it(`${COMPLETE_STEPS_ACTIONS.FINISH_UPDATE} action`, () => {
    // Arrange
    const action = {
      type: COMPLETE_STEPS_ACTIONS.FINISH_UPDATE,
    };

    // Act
    const newState = completeStepsReducer(INITIAL_STATE_COMPLETE_STEPS, action);

    // Assert
    expect(newState).toEqual({
      updated: true,
      loading: false,
      hasError: false,
    });
  });

  it(`${COMPLETE_STEPS_ACTIONS.FAIL_UPDATE} action`, () => {
    // Arrange
    const action = { type: COMPLETE_STEPS_ACTIONS.FAIL_UPDATE };

    // Act
    const newState = completeStepsReducer(INITIAL_STATE_COMPLETE_STEPS, action);

    // Assert
    expect(newState).toEqual({
      updated: false,
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
    const newState = completeStepsReducer(INITIAL_STATE_COMPLETE_STEPS, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_COMPLETE_STEPS);
  });
});
