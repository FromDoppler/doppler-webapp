import { Plan, PLAN_TYPE, CreditPlan, EmailPlan, ContactPlan, PlanType } from '../../doppler-types';
import { getPlanFee } from '../../utils';
import { DopplerLegacyClient } from '../doppler-legacy-client';

export const exclusivePlan = { type: 'exclusive' };
export const freePlan = { type: PLAN_TYPE.free, subscriberLimit: 500 };
export const agenciesPlan = { type: PLAN_TYPE.agencies };

export interface PlanInterface {
  getPlanList(): Promise<Plan[]>;
}

export class PlanService implements PlanInterface {
  private PlanList: Plan[] = [];
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

  async getPlanList(): Promise<Plan[]> {
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

    const findPlanById = (planId: number, planList: Plan[]) =>
      (planList as (CreditPlan | EmailPlan | ContactPlan)[]).find((plan) => plan.id === planId);

    switch (planType) {
      case PLAN_TYPE.byContact:
      case PLAN_TYPE.byEmail:
        // for subscribers and monthly plan will be exclusive until id plan is deployed in doppler
        const planFound = findPlanById(planId, this.PlanList);
        return planFound
          ? planType === PLAN_TYPE.byContact
            ? { ...planFound, currentSubscription: subscription }
            : planFound
          : exclusivePlan;
      case PLAN_TYPE.byCredit:
        return { ...getCheaperPlan(planType, this.PlanList), subscribersCount };
      case PLAN_TYPE.agencies:
        return agenciesPlan;
      default:
        return freePlan;
    }
  }
}

const filterPlansByType = (planType: PlanType, planList: Plan[], fn: any = null) =>
  planList.filter(fn ?? ((plan) => plan.type === planType));

// sort the plans by price from lowest to highest
export const getCheaperPlan = (planType: PlanType, planList: any[]) => {
  const compareByFee = (previousPlan: Plan, nextPlan: Plan): number => {
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
