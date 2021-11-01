import { PLAN_TYPE } from '../../../../doppler-types';
import { allPlans } from '../../../../services/doppler-legacy-client.doubles';
import {
  amountByPlanType,
  INITIAL_STATE_PLANS_BY_TYPE,
  plansByTypeReducer,
  PLANS_BY_TYPE_ACTIONS,
} from './plansByTypeReducer';

describe('plansByTypeReducer', () => {
  it(`${PLANS_BY_TYPE_ACTIONS.FETCHING_STARTED} action`, () => {
    // Arrange
    const action = { type: PLANS_BY_TYPE_ACTIONS.FETCHING_STARTED };

    // Act
    const newState = plansByTypeReducer(INITIAL_STATE_PLANS_BY_TYPE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PLANS_BY_TYPE,
      loading: !INITIAL_STATE_PLANS_BY_TYPE.loading,
    });
  });

  it(`${PLANS_BY_TYPE_ACTIONS.RECEIVE_PLANS_BY_TYPE} action`, () => {
    // Arrange
    const plansByType = allPlans.filter((plan) => plan.type === PLAN_TYPE.byContact);
    const action = {
      type: PLANS_BY_TYPE_ACTIONS.RECEIVE_PLANS_BY_TYPE,
      payload: plansByType,
    };

    // Act
    const newState = plansByTypeReducer(INITIAL_STATE_PLANS_BY_TYPE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PLANS_BY_TYPE,
      loading: false,
      plansByType,
      sliderValuesRange: plansByType.map(amountByPlanType),
    });
  });

  it(`${PLANS_BY_TYPE_ACTIONS.FETCH_FAILED} action`, () => {
    // Arrange
    const action = { type: PLANS_BY_TYPE_ACTIONS.FETCH_FAILED };

    // Act
    const newState = plansByTypeReducer(INITIAL_STATE_PLANS_BY_TYPE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PLANS_BY_TYPE,
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
    const newState = plansByTypeReducer(INITIAL_STATE_PLANS_BY_TYPE, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_PLANS_BY_TYPE);
  });
});
