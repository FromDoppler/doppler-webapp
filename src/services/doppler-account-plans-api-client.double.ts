import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';
import {
  DopplerAccountPlansApiClient,
  PlanDiscount,
  PlanAmountDetails,
  Plan,
  Promotion,
} from './doppler-account-plans-api-client';

export const fakePlan = {
  emailQty: 0,
  subscribersQty: 1500,
  fee: 45,
  type: 'Subscribers',
};

export const fakePrepaidPlan = {
  emailQty: 1500,
  subscribersQty: 1500,
  fee: 45,
  type: 'prepaid',
};

export const fakeAccountPlanDiscounts = [
  { id: 1, monthsAmmount: 1, discountPercentage: 0, description: 'monthly', applyPromo: true },
  { id: 2, monthsAmmount: 3, discountPercentage: 5, description: 'quarterly', applyPromo: false },
  {
    id: 4,
    monthsAmmount: 6,
    discountPercentage: 15,
    description: 'half-yearly',
    applyPromo: false,
  },
  { id: 6, monthsAmmount: 12, discountPercentage: 25, description: 'yearly', applyPromo: false },
];

export const fakePlanAmountDetails = {
  discountPrepayment: { discountPercentage: 0, amount: 0 },
  discountPaymentAlreadyPaid: 0,
  discountPromocode: { discountPercentage: 0, amount: 0, extraCredits: 0 },
  total: 229.5,
  currentMonthTotal: 229.5,
  nextMonthTotal: 229.5,
};

export const fakePlanAmountDetailsWithPromocode = {
  discountPrepayment: { discountPercentage: 0, amount: 0 },
  discountPaymentAlreadyPaid: 0,
  discountPromocode: { discountPercentage: 10, amount: 10, extraCredits: 0 },
  total: 229.5,
  currentMonthTotal: 229.5,
  nextMonthTotal: 229.5,
};

export const fakePlanAmountDetailsWithAdminDiscount = {
  discountPrepayment: { discountPercentage: 0, amount: 0 },
  discountPaymentAlreadyPaid: 0,
  discountPromocode: { discountPercentage: 0, amount: 0, extraCredits: 0 },
  discountPlanFeeAdmin: { discountPercentage: 10, amount: 10 },
  total: 229.5,
  currentMonthTotal: 229.5,
  nextMonthTotal: 229.5,
};

export const fakePromotion = {
  extraCredits: 1543,
  discountPercentage: 17,
  duration: 1,
};

export class HardcodedDopplerAccountPlansApiClient implements DopplerAccountPlansApiClient {
  public async getDiscountsData(
    planId: number,
    paymentMethod: string,
  ): Promise<ResultWithoutExpectedErrors<PlanDiscount[]>> {
    console.log('getDiscountsData');
    await timeout(1500);

    return {
      value: fakeAccountPlanDiscounts,
      success: true,
    };
  }

  public async getPlanAmountDetailsData(
    planId: number,
    discountId: number,
    promocode: string,
  ): Promise<ResultWithoutExpectedErrors<PlanAmountDetails>> {
    console.log('getPlanAmountDetailsData');
    await timeout(1500);

    return {
      success: true,
      value: !promocode ? fakePlanAmountDetails : fakePlanAmountDetailsWithPromocode,
    };
  }

  public async getPlanBillingDetailsData(
    planId: number,
    planType: string,
    discountId: number,
    promocode: string,
  ): Promise<ResultWithoutExpectedErrors<PlanAmountDetails>> {
    console.log('getPlanBillingDetailsData');
    await timeout(1500);

    return {
      success: true,
      value: !promocode ? fakePlanAmountDetails : fakePlanAmountDetailsWithPromocode,
    };
  }

  public async getPlanData(planId: number): Promise<ResultWithoutExpectedErrors<Plan>> {
    console.log('getPlanData');
    await timeout(1500);

    return {
      success: true,
      value: fakePlan,
    };
  }

  public async validatePromocode(
    planId: number,
    promocode: string,
  ): Promise<ResultWithoutExpectedErrors<Promotion>> {
    console.log('validatePromocode');
    await timeout(1500);

    return {
      value: fakePromotion,
      success: true,
    };
  }
}
