import { getPlanFee } from '../../utils';
import { DopplerLegacyClient } from '../doppler-legacy-client';

export const exclusivePlan = { type: 'exclusive' };
export const freePlan = { type: 'free', subscriberLimit: 500 };
export const agenciesPlan = { type: 'agencies' };

export interface PlanInterface {
  getPlanList(): Promise<any[]>;
}

export class PlanService implements PlanInterface {
  private PlanList: any[] = [];
  private readonly appSessionRef: any;
  private readonly dopplerLegacyClient: DopplerLegacyClient;

  constructor({
    dopplerLegacyClient,
    appSessionRef,
  }: {
    dopplerLegacyClient: DopplerLegacyClient;
    appSessionRef: any;
  }) {
    this.dopplerLegacyClient = dopplerLegacyClient;
    this.appSessionRef = appSessionRef;
  }

  async getPlanList(): Promise<any[]> {
    return this.PlanList.length
      ? this.PlanList
      : (this.PlanList = await this.dopplerLegacyClient.getAllPlans());
  }

  getCurrentPlan() {
    const {
      planType,
      idPlan: planId,
      planSubscription: subscription,
      subscribersCount,
    } = this.appSessionRef.current.userData.user.plan;

    const findPlanById = (planId: number, planList: any[]) =>
      planList.find((plan) => plan.id === planId);

    switch (planType) {
      case 'subscribers':
      case 'monthly-deliveries':
        // for subscribers and monthly plan will be exclusive until id plan is deployed in doppler
        const planFound = findPlanById(planId, this.PlanList);
        return planFound
          ? planType === 'subscribers'
            ? { ...planFound, currentSubscription: subscription }
            : planFound
          : exclusivePlan;
      case 'prepaid':
        return { ...getCheaperPlan(planType, this.PlanList), subscribersCount };
      case 'agencies':
        return agenciesPlan;
      default:
        return freePlan;
    }
  }
}

const filterPlansByType = (planType: any, planList: any[], fn: any = null) =>
  planList.filter(fn ?? ((plan) => plan.type === planType));

// sort the plans by price from lowest to highest
export const getCheaperPlan = (planType: any, planList: any[]) => {
  const compareByFee = (previousPlan: any, nextPlan: any): number => {
    const priceOfPreviousPlan = getPlanFee(previousPlan);
    const priceOfNextPlan = getPlanFee(nextPlan);

    return priceOfPreviousPlan < priceOfNextPlan
      ? -1
      : priceOfPreviousPlan > priceOfNextPlan
      ? 1
      : 0;
  };
  const cheaperPlan = filterPlansByType(planType, planList).sort(compareByFee);
  return cheaperPlan[0];
};
