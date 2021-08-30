import { ResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';

export interface DopplerAccountPlansApiClient {
  getDiscountsData(
    planId: number,
    paymentMethod: string,
  ): Promise<ResultWithoutExpectedErrors<PlanDiscount[]>>;
}

interface DopplerAccountPlansApiConnectionData {
  jwtToken: string;
  email: string;
}

export interface PlanDiscount {
  id: number;
  description: string;
  discountPercentage: number;
  monthsAmmount: number;
}

export class HttpDopplerAccountPlansApiClient implements DopplerAccountPlansApiClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;
  private readonly connectionDataRef: RefObject<AppSession>;

  constructor({
    axiosStatic,
    baseUrl,
    connectionDataRef,
  }: {
    axiosStatic: AxiosStatic;
    baseUrl: string;
    connectionDataRef: RefObject<AppSession>;
  }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: this.baseUrl,
    });
    this.connectionDataRef = connectionDataRef;
  }

  private getDopplerAccountPlansApiConnectionData(): DopplerAccountPlansApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler Billing User API connection data is not available');
    }
    return {
      jwtToken: connectionData.jwtToken,
      email: connectionData.userData.user.email,
    };
  }

  private getDiscountDescription = (monthsAmmount: number) => {
    switch (monthsAmmount) {
      case 1:
        return 'monthly';
      case 3:
        return 'quarterly';
      case 6:
        return 'half-yearly';
      case 12:
        return 'yearly';
      default:
        return '';
    }
  };

  private mapPlanDiscounts(data: any): PlanDiscount[] {
    return data.map((discount: any) => ({
      id: discount.idDiscountPlan,
      description: this.getDiscountDescription(Number(discount.monthPlan)),
      discountPercentage: discount.discountPlanFee,
      monthsAmmount: Number(discount.monthPlan),
    }));
  }

  public async getDiscountsData(
    planId: number,
    paymentMethod: string,
  ): Promise<ResultWithoutExpectedErrors<PlanDiscount[]>> {
    try {
      const { jwtToken } = this.getDopplerAccountPlansApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `plans/${planId}/${paymentMethod}/discounts`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapPlanDiscounts(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }
}
