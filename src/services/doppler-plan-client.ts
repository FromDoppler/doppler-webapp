import { DopplerLegacyClient, PlanModel, planType, userType } from './doppler-legacy-client';

export class DopplerPlanClient {
  private PlanList: PlanModel[] = [];
  private readonly dopplerLegacyClient: DopplerLegacyClient;

  constructor({ dopplerLegacyClient }: { dopplerLegacyClient: DopplerLegacyClient }) {
    this.dopplerLegacyClient = dopplerLegacyClient;
  }

  async getPlanData(): Promise<PlanModel[]> {
    return this.PlanList.length
      ? this.PlanList
      : (this.PlanList = await this.dopplerLegacyClient.getAllPlans());
  }

  async getFeaturedPlan(idPlan: number): Promise<PlanModel[]> {
    const planList = await this.getPlanData();
    const result = [];
    const currentPlan = planList.find((plan) => plan.id === idPlan);
    if (!currentPlan) {
      return [];
    }
    const featuredPlan = planList.find(
      (plan) =>
        currentPlan.subscribersByMonth === plan.subscribersByMonth &&
        currentPlan.emailsByMonth === plan.emailsByMonth &&
        plan.type === planType.PLUS,
    );

    result.push(currentPlan);
    if (!!featuredPlan) {
      result.push(featuredPlan);
    }
    return result;
  }

  mapPlanType(planTypeText: string): planType {
    switch (planTypeText) {
      case 'FREE': {
        return planType.FREE;
      }
      case 'STANDARD': {
        return planType.STANDARD;
      }
      case 'PLUS': {
        return planType.PLUS;
      }
      case 'ENTERPRISE': {
        return planType.ENTERPRISE;
      }
      default: {
        return planType.FREE;
      }
    }
  }

  mapUserType(planTypeText: string): userType {
    switch (planTypeText) {
      case 'FREE': {
        return userType.FREE;
      }
      case 'HIGH_VOLUME': {
        return userType.HIGH_VOLUME;
      }
      case 'PREPAID': {
        return userType.PREPAID;
      }
      case 'SUBSCRIBERS': {
        return userType.SUBSCRIBERS_MONTHLY;
      }
      default: {
        return userType.FREE;
      }
    }
  }

  async getPlanListByType(planTypeText: string, userTypeText: string): Promise<PlanModel[]> {
    const searchPlanType: planType = this.mapPlanType(planTypeText.toUpperCase());
    const searchUserType: userType = this.mapUserType(userTypeText.toUpperCase());
    const planList = await this.getPlanData();
    const result = planList.filter(
      (plan) =>
        plan.type === searchPlanType &&
        plan.userType === searchUserType &&
        plan.fee &&
        (plan.subscribersByMonth || plan.emailsByMonth),
    );
    return result;
  }
}
