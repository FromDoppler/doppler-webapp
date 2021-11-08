import { PLAN_TYPE, SUBSCRIPTION_TYPE } from '../../../../doppler-types';
import { allPlans } from '../../../../services/doppler-legacy-client.doubles';
import {
  amountByPlanType,
  INITIAL_STATE_PLANS_BY_TYPE,
  mapDiscount,
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
    const discounts = plansByType[0].billingCycleDetails?.map(mapDiscount) ?? [];
    expect(newState).toEqual({
      ...INITIAL_STATE_PLANS_BY_TYPE,
      loading: false,
      plansByType,
      sliderValuesRange: plansByType.map(amountByPlanType),
      discounts,
      selectedDiscount: discounts[0],
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

  it(`${PLANS_BY_TYPE_ACTIONS.CHANGE_SELECTED_DISCOUNT} action`, () => {
    // Arrange
    const selectedDiscount = {
      id: 2,
      subscriptionType: SUBSCRIPTION_TYPE.quarterly,
      discountPercentage: 10,
    };
    const action = {
      type: PLANS_BY_TYPE_ACTIONS.CHANGE_SELECTED_DISCOUNT,
      payload: selectedDiscount,
    };

    // Act
    const newState = plansByTypeReducer(INITIAL_STATE_PLANS_BY_TYPE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PLANS_BY_TYPE,
      selectedDiscount,
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
