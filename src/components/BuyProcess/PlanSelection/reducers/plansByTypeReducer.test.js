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

  it(`${PLANS_BY_TYPE_ACTIONS.FINISH_FETCH} action with plan subscription equal to 1 month`, () => {
    // Arrange
    const planSubscription = 1;
    const plansByType = allPlans.filter((plan) => plan.type === PLAN_TYPE.byContact);
    const initialState = {
      ...INITIAL_STATE_PLANS_BY_TYPE,
      selectedPlanIndex: 15, // An arbitrary plan
    };
    const action = {
      type: PLANS_BY_TYPE_ACTIONS.FINISH_FETCH,
      payload: {
        plansByType,
        currentSubscriptionUser: planSubscription,
      },
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

  it(`${PLANS_BY_TYPE_ACTIONS.FINISH_FETCH} action with plan subscription equal to 3 months`, () => {
    // Arrange
    const planSubscription = 3;
    const plansByType = allPlans.filter((plan) => plan.type === PLAN_TYPE.byContact);
    const initialState = {
      ...INITIAL_STATE_PLANS_BY_TYPE,
      selectedPlanIndex: 15, // An arbitrary plan
    };
    const action = {
      type: PLANS_BY_TYPE_ACTIONS.FINISH_FETCH,
      payload: {
        plansByType,
        currentSubscriptionUser: planSubscription,
      },
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
        selectedDiscount: discounts[1],
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

  describe(`${PLANS_BY_TYPE_ACTIONS.SELECT_DISCOUNT} action`, () => {
    it(`should set a new discount and save discount position when index position exists`, () => {
      // Arrange
      // TODO: it is not a realistic test because selectedDiscount should be one of the
      // plan's discounts

      const discountA = {
        id: 1,
        subscriptionType: SUBSCRIPTION_TYPE.quarterly,
        discountPercentage: 10,
      };

      const discountB = {
        id: 2,
        subscriptionType: SUBSCRIPTION_TYPE.monthly,
        discountPercentage: 20,
      };

      const discounts = [discountA, discountB];

      const expectedSelectedDiscountIndex = 1;

      const initialState = {
        ...INITIAL_STATE_PLANS_BY_TYPE,
        discounts,
      };

      const action = {
        type: PLANS_BY_TYPE_ACTIONS.SELECT_DISCOUNT,
        payload: discountB,
      };

      // Act
      const newState = plansByTypeReducer(initialState, action);

      // Assert
      expect(newState).toEqual(
        expect.objectContaining({
          ...initialState,
          selectedDiscount: discountB,
          selectedDiscountIndex: expectedSelectedDiscountIndex,
        }),
      );
    });

    it(`should set a new discount and reset discount position when index position does not exist`, () => {
      // Arrange
      // TODO: it is not a realistic test because selectedDiscount should be one of the
      // plan's discounts

      const discountA = {
        id: 1,
        subscriptionType: SUBSCRIPTION_TYPE.quarterly,
        discountPercentage: 10,
      };

      const discountB = {
        id: 2,
        subscriptionType: SUBSCRIPTION_TYPE.monthly,
        discountPercentage: 20,
      };
      const discountC = {
        id: 3,
        subscriptionType: SUBSCRIPTION_TYPE.yearly,
        discountPercentage: 30,
      };

      const discounts = [discountA, discountB];

      const expectedSelectedDiscountIndex = 0;

      const initialState = {
        ...INITIAL_STATE_PLANS_BY_TYPE,
        discounts,
      };

      const action = {
        type: PLANS_BY_TYPE_ACTIONS.SELECT_DISCOUNT,
        payload: discountC,
      };

      // Act
      const newState = plansByTypeReducer(initialState, action);

      // Assert
      expect(newState).toEqual(
        expect.objectContaining({
          ...initialState,
          selectedDiscount: discountA,
          selectedDiscountIndex: expectedSelectedDiscountIndex,
        }),
      );
    });
  });

  describe(`${PLANS_BY_TYPE_ACTIONS.SELECT_PLAN} action`, () => {
    it('Should select a new plan and set previous selected discount when its index exists in new plan discounts ', () => {
      // Arrange

      const discountA = {
        id: 1,
        billingCycle: 'monthly',
        discountPercentage: 10,
      };

      const discountB = {
        id: 2,
        billingCycle: 'quarterly',
        discountPercentage: 20,
      };
      const discountC = {
        id: 3,
        billingCycle: 'yearly',
        discountPercentage: 30,
      };

      const discounts = [discountA, discountB, discountC];
      const desiredPlan = { desiredPlan: true, billingCycleDetails: discounts };
      const initialState = {
        ...INITIAL_STATE_PLANS_BY_TYPE,
        plansByType: [{}, {}, desiredPlan, {}],
        selectedDiscountIndex: 2,
      };
      const selectedPlanIndex = 2;
      const expectedSelectedDiscountIndex = 2;
      const expectedDiscounts = [
        {
          id: 1,
          subscriptionType: 'monthly',
          numberMonths: 1,
          discountPercentage: 10,
        },
        {
          id: 2,
          subscriptionType: 'quarterly',
          numberMonths: 3,
          discountPercentage: 20,
        },
        {
          id: 3,
          subscriptionType: 'yearly',
          numberMonths: 12,
          discountPercentage: 30,
        },
      ];

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
          discounts: expectedDiscounts,
          selectedDiscount: expectedDiscounts[2],
          selectedDiscountIndex: expectedSelectedDiscountIndex,
        }),
      );
    });

    it('Should select a new plan and set first discount index when previous discount index does not exist in new plan discounts ', () => {
      // Arrange

      const discountA = {
        id: 1,
        billingCycle: 'monthly',
        discountPercentage: 10,
      };

      const discountB = {
        id: 2,
        billingCycle: 'quarterly',
        discountPercentage: 20,
      };

      const discounts = [discountA, discountB];
      const previousDiscounts = [
        {
          id: 1,
          subscriptionType: 'monthly',
          numberMonths: 1,
          discountPercentage: 10,
        },
        {
          id: 2,
          subscriptionType: 'quarterly',
          numberMonths: 3,
          discountPercentage: 20,
        },
        {
          id: 3,
          subscriptionType: 'monthly',
          numberMonths: 12,
          discountPercentage: 25,
        },
      ];
      const desiredPlan = { desiredPlan: true, billingCycleDetails: discounts };
      const initialState = {
        ...INITIAL_STATE_PLANS_BY_TYPE,
        plansByType: [{}, {}, {}, {}, {}, desiredPlan, {}],
        selectedDiscountIndex: 2,
        previousDiscounts,
      };
      const selectedPlanIndex = 5;
      const expectedSelectedDiscountIndex = 0;
      const expectedDiscounts = [
        {
          id: 1,
          subscriptionType: 'monthly',
          numberMonths: 1,
          discountPercentage: 10,
        },
        {
          id: 2,
          subscriptionType: 'quarterly',
          numberMonths: 3,
          discountPercentage: 20,
        },
      ];

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
          discounts: expectedDiscounts,
          selectedDiscount: expectedDiscounts[0],
          selectedDiscountIndex: expectedSelectedDiscountIndex,
        }),
      );
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
