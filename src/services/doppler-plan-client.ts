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
        currentPlan.emailsQty === plan.emailsQty &&
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

  async getPlans(): Promise<{ type: number; fee: number }[]> {
    const planList = await this.getPlanData();
    const filteredPlans = planList.sort((plan1, plan2) => Number(plan1.fee) - Number(plan2.fee));

    const result = [
      {
        type: planType.STANDARD,
        fee: filteredPlans.filter((plan) => plan.type === planType.STANDARD && plan.fee)[0].fee,
      },
      {
        type: planType.PLUS,
        fee: filteredPlans.filter((plan) => plan.type === planType.PLUS && plan.fee)[0].fee,
      },
    ];
    console.log('Los planes filtrados son', result);
    return result;
  }
}
