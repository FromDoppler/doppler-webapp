import { PLAN_TYPE } from '../../../../doppler-types';
import { allPlans } from '../../../../services/doppler-legacy-client.doubles';
import {
  amountByPlanType,
  INITIAL_STATE_PLAN_TYPES,
  planTypesReducer,
  PLAN_TYPES_ACTIONS,
} from './planTypesReducer';

describe('planTypesReducer', () => {
  it(`${PLAN_TYPES_ACTIONS.FETCHING_STARTED} action`, () => {
    // Arrange
    const action = { type: PLAN_TYPES_ACTIONS.FETCHING_STARTED };

    // Act
    const newState = planTypesReducer(INITIAL_STATE_PLAN_TYPES, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PLAN_TYPES,
      loading: !INITIAL_STATE_PLAN_TYPES.loading,
    });
  });

  it(`${PLAN_TYPES_ACTIONS.FETCHING_PLANS_BY_TYPE_STARTED} action`, () => {
    // Arrange
    const action = { type: PLAN_TYPES_ACTIONS.FETCHING_PLANS_BY_TYPE_STARTED };

    // Act
    const newState = planTypesReducer(INITIAL_STATE_PLAN_TYPES, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PLAN_TYPES,
      loadingPlansByType: !INITIAL_STATE_PLAN_TYPES.loadingPlansByType,
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

  it(`${PLAN_TYPES_ACTIONS.RECEIVE_PLANS_BY_TYPES} action`, () => {
    // Arrange
    const plansByType = allPlans.filter((plan) => plan.type === PLAN_TYPE.byContact);
    const action = {
      type: PLAN_TYPES_ACTIONS.RECEIVE_PLANS_BY_TYPES,
      payload: plansByType,
    };

    // Act
    const newState = planTypesReducer(INITIAL_STATE_PLAN_TYPES, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PLAN_TYPES,
      loadingPlansByType: false,
      plansByType,
      sliderValuesRange: plansByType.map(amountByPlanType),
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
