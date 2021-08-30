import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';
import { DopplerAccountPlansApiClient, PlanDiscount } from './doppler-account-plans-api-client';

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
}
