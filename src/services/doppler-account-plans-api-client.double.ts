import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';
import {
  DopplerAccountPlansApiClient,
  PlanDiscount,
  PlanAmountDetails,
  Plan,
  fakePlanAmountDetails,
} from './doppler-account-plans-api-client';

export const fakePlan = {
  emailQty: 0,
  subscribersQty: 1500,
  fee: 45,
  type: 'Subscribers',
};

export const fakeAccountPlanDiscounts = [
  { id: 1, monthsAmmount: 1, discountPercentage: 0, description: 'monthly' },
  { id: 2, monthsAmmount: 3, discountPercentage: 5, description: 'quarterly' },
  { id: 4, monthsAmmount: 6, discountPercentage: 15, description: 'half-yearly' },
  { id: 6, monthsAmmount: 12, discountPercentage: 25, description: 'yearly' },
];

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
      value: fakePlanAmountDetails,
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
}
