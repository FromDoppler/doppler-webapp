import { PLAN_TYPE } from '../../../../doppler-types';
import { fakePromotion } from '../../../../services/doppler-account-plans-api-client.double';
import {
  fakePaymentMethodInformation,
  fakePaymentMethodInformationWithTransfer,
  fakeBillingInformation,
  fakeUserPlan,
} from '../../../../services/doppler-billing-user-api-client.double';
import {
  INITIAL_STATE_CHECKOUT_SUMMARY,
  CHECKOUT_SUMMARY_ACTIONS,
  checkoutSummaryReducer,
} from './checkoutSummaryReducer';

describe('checkoutSummaryReducer', () => {
  it(`${CHECKOUT_SUMMARY_ACTIONS.START_FETCH} action`, () => {
    // Arrange
    const action = { type: CHECKOUT_SUMMARY_ACTIONS.START_FETCH };

    // Act
    const newState = checkoutSummaryReducer(INITIAL_STATE_CHECKOUT_SUMMARY, action);

    // Assert
    expect(newState).toEqual(
      expect.objectContaining({
        loading: true,
      }),
    );
  });

  it(`${CHECKOUT_SUMMARY_ACTIONS.FINISH_FETCH} action`, () => {
    // Arrange
    const billingInformation = fakeBillingInformation;
    const currentUserPlan = fakeUserPlan;
    const promotion = fakePromotion;
    const discount = 'quarterly';
    const paymentMethod = 'CC';

    const initialState = {
      ...INITIAL_STATE_CHECKOUT_SUMMARY,
      selectedPlanIndex: 15, // An arbitrary plan
    };
    const action = {
      type: CHECKOUT_SUMMARY_ACTIONS.FINISH_FETCH,
      payload: {
        billingInformation,
        currentUserPlan,
        promotion,
        discount,
        paymentMethod,
      },
    };

    // Act
    const newState = checkoutSummaryReducer(initialState, action);

    // Assert
    expect(newState).toEqual(
      expect.objectContaining({
        loading: false,
        billingCountry: billingInformation.country,
        remainingCredits: currentUserPlan.remainingCredits,
        promotion,
        discount,
        paymentMethod,
        quantity: currentUserPlan.emailQty,
      }),
    );
  });

  it(`${CHECKOUT_SUMMARY_ACTIONS.FAIL_FETCH} action`, () => {
    // Arrange
    const action = { type: CHECKOUT_SUMMARY_ACTIONS.FAIL_FETCH };

    // Act
    const newState = checkoutSummaryReducer(INITIAL_STATE_CHECKOUT_SUMMARY, action);

    // Assert
    expect(newState).toEqual(
      expect.objectContaining({
        loading: false,
        hasError: true,
      }),
    );
  });

  it('should return initialState when the action is not defined', () => {
    // Arrange
    const action = {
      type: 'my-action',
    };

    // Act
    const newState = checkoutSummaryReducer(INITIAL_STATE_CHECKOUT_SUMMARY, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_CHECKOUT_SUMMARY);
  });
});
