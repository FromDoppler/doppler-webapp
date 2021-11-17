import { PLAN_TYPE, SUBSCRIPTION_TYPE } from '../../../../doppler-types';
import { allPlans } from '../../../../services/doppler-legacy-client.doubles';
import {
  amountByPlanType,
  INITIAL_STATE_PLANS_BY_TYPE,
  mapDiscount,
  orderDiscount,
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
    const discounts =
      plansByType[0].billingCycleDetails?.map(mapDiscount).sort(orderDiscount) ?? [];
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

  it(`${PLANS_BY_TYPE_ACTIONS.SEARCH_DISCOUNTS_BY_INDEX_PLAN} action`, () => {
    // Arrange
    const plansByType = allPlans.filter((plan) => plan.type === PLAN_TYPE.byContact);

    const actionPopulatePlans = {
      type: PLANS_BY_TYPE_ACTIONS.RECEIVE_PLANS_BY_TYPE,
      payload: plansByType,
    };

    const _selectedPlanIndex = 2;
    const selectedDiscountIndex = 1;
    const _discounts =
      plansByType[_selectedPlanIndex]?.billingCycleDetails?.map(mapDiscount).sort(orderDiscount) ??
      [];

    const selectedDiscount = _discounts[selectedDiscountIndex];

    const action = {
      type: PLANS_BY_TYPE_ACTIONS.SEARCH_DISCOUNTS_BY_INDEX_PLAN,
      payload: {
        _selectedPlanIndex,
        selectedDiscountIndex,
      },
    };

    // Act
    const STATEPOPULATED = plansByTypeReducer(INITIAL_STATE_PLANS_BY_TYPE, actionPopulatePlans);
    const newState = plansByTypeReducer(STATEPOPULATED, action);

    // Assert
    expect(newState).toEqual({
      ...STATEPOPULATED,
      discounts: _discounts,
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
