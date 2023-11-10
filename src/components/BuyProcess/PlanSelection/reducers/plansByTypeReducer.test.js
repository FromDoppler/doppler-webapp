import { SUBSCRIPTION_TYPE } from '../../../../doppler-types';
import {
  INITIAL_STATE_PLANS_BY_TYPE,
  PLANS_BY_TYPE_ACTIONS,
  plansByTypeReducer,
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
        hasError: false,
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
