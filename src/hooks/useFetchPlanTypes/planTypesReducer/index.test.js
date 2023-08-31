import { INITIAL_STATE_PLAN_TYPES, PLAN_TYPES_ACTIONS, planTypesReducer } from '.';
import { PLAN_TYPE } from '../../../doppler-types';

describe('planTypesReducer', () => {
  it(`${PLAN_TYPES_ACTIONS.FETCHING_STARTED} action`, () => {
    // Arrange
    const action = { type: PLAN_TYPES_ACTIONS.FETCHING_STARTED };

    // Act
    const newState = planTypesReducer(INITIAL_STATE_PLAN_TYPES, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PLAN_TYPES,
    });
  });

  it(`${PLAN_TYPES_ACTIONS.RECEIVE_PLAN_TYPES} action`, () => {
    // Arrange
    const planTypes = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit];
    const action = {
      type: PLAN_TYPES_ACTIONS.RECEIVE_PLAN_TYPES,
      payload: planTypes,
    };

    // Act
    const newState = planTypesReducer(INITIAL_STATE_PLAN_TYPES, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PLAN_TYPES,
      loading: false,
      planTypes,
    });
  });

  it(`${PLAN_TYPES_ACTIONS.FETCH_FAILED} action`, () => {
    // Arrange
    const action = { type: PLAN_TYPES_ACTIONS.FETCH_FAILED };

    // Act
    const newState = planTypesReducer(INITIAL_STATE_PLAN_TYPES, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PLAN_TYPES,
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
    const newState = planTypesReducer(INITIAL_STATE_PLAN_TYPES, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_PLAN_TYPES);
  });
});
