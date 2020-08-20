import { DopplerLegacyClient, PlanModel, planType } from './doppler-legacy-client';

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

  async getPlanListByType(planType: number, userType?: number): Promise<PlanModel[]> {
    const planList = await this.getPlanData();
    const result = planList.filter((plan) =>
      !!userType ? plan.type === planType && plan.userType === userType : plan.type === planType,
    );
    return result;
  }
}
