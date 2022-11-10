import { fakeSystemUsageSummary } from '../../../services/dashboardService/SystemUsageSummary.double';
import {
  firstStepsReducer,
  FIRST_STEPS_ACTIONS,
  INITIAL_STATE_FIRST_STEPS,
  mapSystemUsageSummary,
} from './firstStepsReducer';

describe('firstStepsReducer', () => {
  it(`${FIRST_STEPS_ACTIONS.START_FETCH} action`, () => {
    // Arrange
    const action = { type: FIRST_STEPS_ACTIONS.START_FETCH };

    // Act
    const newState = firstStepsReducer(INITIAL_STATE_FIRST_STEPS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_FIRST_STEPS,
      loading: !INITIAL_STATE_FIRST_STEPS.loading,
      hasError: false,
    });
  });

  it(`${FIRST_STEPS_ACTIONS.FINISH_FETCH} action`, () => {
    // Arrange
    const action = {
      type: FIRST_STEPS_ACTIONS.FINISH_FETCH,
      payload: mapSystemUsageSummary(fakeSystemUsageSummary),
    };

    // Act
    const newState = firstStepsReducer(INITIAL_STATE_FIRST_STEPS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_FIRST_STEPS,
      loading: false,
      hasError: false,
      firstStepsData: mapSystemUsageSummary(fakeSystemUsageSummary),
    });
  });

  it(`${FIRST_STEPS_ACTIONS.FAIL_FETCH} action`, () => {
    // Arrange
    const action = { type: FIRST_STEPS_ACTIONS.FAIL_FETCH };

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
