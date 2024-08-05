import { ResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';

export interface DopplerAccountPlansApiClient {
  getDiscountsData(
    planId: number,
    paymentMethod: string,
  ): Promise<ResultWithoutExpectedErrors<PlanDiscount[]>>;

  getPlanAmountDetailsData(
    planId: number,
    discountId: number,
    promocode: string,
  ): Promise<ResultWithoutExpectedErrors<PlanAmountDetails>>;

  getPlanData(planId: number, planType: number): Promise<ResultWithoutExpectedErrors<Plan>>;

  getCoversationsPLans(): Promise<ResultWithoutExpectedErrors<any>>;

  validatePromocode(
    planId: number,
    promocode: string,
  ): Promise<ResultWithoutExpectedErrors<Promotion>>;
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
  applyPromo: boolean;
}

export interface LandingPack {
  planId: number;
  description: string;
  landingsQty: number;
  price: number;
  unitPrice: number;
}

export interface DiscountPrepayment {
  discountPercentage: number;
  amount: number;
}

export interface DiscountPromocode {
  discountPercentage: number;
  amount: number;
  extraCredits: number;
}

export interface PlanAmountDetails {
  discountPaymentAlreadyPaid: number;
  discountPrepayment: DiscountPrepayment;
  discountPromocode: DiscountPromocode;
  total: number;
  currentMonthTotal: number;
  nextMonthTotal: number;
}

export interface Plan {
  emailQty: number;
  subscribersQty: number;
  fee: number;
  type: string;
}

export interface Promotion {
  extraCredits: number;
  discountPercentage: number;
  duration: number;
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
      throw new Error('Doppler Account Plans API connection data is not available');
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
      applyPromo: discount.applyPromo,
    }));
  }

  private mapLandingPacks(data: any): LandingPack[] {
    return data.map((landingPack: any) => ({
      planId: landingPack.planId,
      description: landingPack.description,
      landingsQty: Number(landingPack.landingsQty),
      price: Number(landingPack.fee),
      unitPrice: Number(landingPack.fee) / Number(landingPack.landingsQty),
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

  public async getPlanAmountDetailsData(
    planId: number,
    discountId: number,
    promocode: string,
  ): Promise<ResultWithoutExpectedErrors<PlanAmountDetails>> {
    try {
      const { email, jwtToken } = this.getDopplerAccountPlansApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `accounts/${email}/newplan/${planId}/calculate?discountId=${discountId}&promocode=${promocode}`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: response.data };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getPlanBillingDetailsData(
    planId: number,
    planType: string,
    discountId: number,
    promocode: string,
  ): Promise<ResultWithoutExpectedErrors<PlanAmountDetails>> {
    try {
      const { email, jwtToken } = this.getDopplerAccountPlansApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `accounts/${email}/newplan/${planType}/${planId}/calculate-amount?discountId=${discountId}&promocode=${promocode}`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: response.data };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getPlanBillingDetailsLandingPacksData(
    landingIds: string,
    landingPacks: string,
  ): Promise<ResultWithoutExpectedErrors<any>> {
    try {
      const { email, jwtToken } = this.getDopplerAccountPlansApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `accounts/${email}/newplan/landingplan/calculate?landingids=${landingIds}&landingpacks=${landingPacks}`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: response.data };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getPlanChatBillingDetailsData(
    planId: number,
    discountId: number,
  ): Promise<ResultWithoutExpectedErrors<any>> {
    try {
      const { email, jwtToken } = this.getDopplerAccountPlansApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `accounts/${email}/newplan/Chat/${planId}/calculate-amount?discountId=${discountId}`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: response.data };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getPlanData(
    planId: number,
    planType: number,
  ): Promise<ResultWithoutExpectedErrors<Plan>> {
    try {
      const { jwtToken } = this.getDopplerAccountPlansApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `${planType}/plans/${planId}`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: response.data };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getCoversationsPLans(): Promise<ResultWithoutExpectedErrors<any>> {
    try {
      const { jwtToken } = this.getDopplerAccountPlansApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `conversation-plans`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: response.data };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async validatePromocode(
    planId: number,
    promocode: string,
  ): Promise<ResultWithoutExpectedErrors<Promotion>> {
    try {
      const { jwtToken } = this.getDopplerAccountPlansApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `plans/${planId}/validate/${encodeURIComponent(promocode)}`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: response.data };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getLandingPacks(): Promise<ResultWithoutExpectedErrors<LandingPack[]>> {
    try {
      const { jwtToken } = this.getDopplerAccountPlansApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `landing-plans`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapLandingPacks(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }
}
