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
  it(`${PLANS_BY_TYPE_ACTIONS.START_FETCH} action`, () => {
    // Arrange
    const action = { type: PLANS_BY_TYPE_ACTIONS.START_FETCH };

    // Act
    const newState = plansByTypeReducer(INITIAL_STATE_PLANS_BY_TYPE, action);

    // Assert
    expect(newState).toEqual(
      expect.objectContaining({
        loading: true,
      }),
    );
  });

  it(`${PLANS_BY_TYPE_ACTIONS.FINISH_FETCH} action`, () => {
    // Arrange
    const plansByType = allPlans.filter((plan) => plan.type === PLAN_TYPE.byContact);
    const initialState = {
      ...INITIAL_STATE_PLANS_BY_TYPE,
      selectedPlanIndex: 15, // An arbitrary plan
    };
    const action = {
      type: PLANS_BY_TYPE_ACTIONS.FINISH_FETCH,
      payload: plansByType,
    };

    // Act
    const newState = plansByTypeReducer(initialState, action);

    // Assert
    const discounts =
      plansByType[0].billingCycleDetails?.map(mapDiscount).sort(orderDiscount) ?? [];
    expect(newState).toEqual(
      expect.objectContaining({
        loading: false,
        selectedPlanIndex: 0,
        selectedPlan: plansByType[0],
        plansByType,
        sliderValuesRange: plansByType.map(amountByPlanType),
        discounts,
        selectedDiscount: discounts[0],
      }),
    );
  });

  it(`${PLANS_BY_TYPE_ACTIONS.FAIL_FETCH} action`, () => {
    // Arrange
    const action = { type: PLANS_BY_TYPE_ACTIONS.FAIL_FETCH };

    // Act
    const newState = plansByTypeReducer(INITIAL_STATE_PLANS_BY_TYPE, action);

    // Assert
    expect(newState).toEqual(
      expect.objectContaining({
        loading: false,
        hasError: true,
      }),
    );
  });

  it(`${PLANS_BY_TYPE_ACTIONS.SELECT_DISCOUNT} action`, () => {
    // Arrange
    // TODO: it is not a realistic test because selectedDiscount should be one of the
    // plan's discounts
    const selectedDiscount = {
      id: 2,
      subscriptionType: SUBSCRIPTION_TYPE.quarterly,
      discountPercentage: 10,
    };
    const action = {
      type: PLANS_BY_TYPE_ACTIONS.SELECT_DISCOUNT,
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

  it(`${PLANS_BY_TYPE_ACTIONS.SELECT_PLAN} action`, () => {
    // Arrange
    const desiredPlan = { desiredPlan: true };
    const initialState = {
      ...INITIAL_STATE_PLANS_BY_TYPE,
      plansByType: [{}, {}, {}, {}, {}, desiredPlan, {}],
    };
    const selectedPlanIndex = 5;
    const action = {
      type: PLANS_BY_TYPE_ACTIONS.SELECT_PLAN,
      payload: selectedPlanIndex,
    };

    // Act
    const newState = plansByTypeReducer(initialState, action);

    // Assert
    expect(newState).toEqual(
      expect.objectContaining({
        selectedPlanIndex,
        selectedPlan: desiredPlan,
      }),
    );
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
