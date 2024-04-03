import { Plan, PLAN_TYPE, CreditPlan, EmailPlan, ContactPlan, PlanType } from '../../doppler-types';
import { getInfoPlanType, getPlanFee, orderPlanTypes } from '../../utils';
import { DopplerLegacyClient } from '../doppler-legacy-client';

export const exclusivePlan = { type: 'exclusive' };
export const freePlan = { type: PLAN_TYPE.free, subscriberLimit: 500 };
export const agenciesPlan = { type: PLAN_TYPE.agencies };

export interface PlanInterface {
  getPlanList(): Promise<Plan[]>;
}

export interface DistinctPlan {
  type: PlanType;
  minPrice: number;
  info?: String | Object | Node | null;
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

  async getPlanTypes(): Promise<PlanType[]> {
    const planList = await this.getPlanList();
    const currentPlan: any = this.getCurrentPlan();

    const potentialUpgradePlans: Plan[] = getPotentialUpgrades(currentPlan, planList);

    const typesAllowed: PlanType[] = potentialUpgradePlans.map((plan) => plan.type);
    const distinctTypesAllowed: PlanType[] = [...Array.from(new Set<PlanType>(typesAllowed))];

    return orderPlanTypes(distinctTypesAllowed);
  }

  async getDistinctPlans(): Promise<DistinctPlan[]> {
    const planList = await this.getPlanList();
    const currentPlan: any = this.getCurrentPlan();

    const potentialUpgradePlans: Plan[] = getPotentialUpgrades(currentPlan, planList);
    const typesAllowed: PlanType[] = potentialUpgradePlans.map((plan) => plan.type);
    const distinctTypesAllowed: PlanType[] = [...Array.from(new Set<PlanType>(typesAllowed))];
    const distinctPlanTypesOrdered = orderPlanTypes(distinctTypesAllowed);
    const distinctPlansAllowed: DistinctPlan[] = distinctPlanTypesOrdered.map((type) => {
      const priceByPlanType: number = Math.min(
        ...potentialUpgradePlans
          .filter((plan) => plan.type === type)
          .map((plan) => getPlanFee(plan)),
      );
      return {
        type,
        minPrice: priceByPlanType,
        info: getInfoPlanType(type),
      };
    });
    return distinctPlansAllowed;
  }

  async getPlansByType(planType: PlanType): Promise<Plan[]> {
    const currentPlan: any = this.getCurrentPlan();
    const planList = await this.getPlanList();

    const potentialUpgradePlans = getPotentialUpgrades(currentPlan, planList);
    const plansByType = filterPlansByType(planType, potentialUpgradePlans);

    return plansByType.sort(compareByFee);
  }
}

const filterPlansByType = (planType: PlanType, planList: Plan[], fn: any = null) =>
  planList.filter(fn ?? ((plan) => plan.type === planType));

// sort the plans by price from lowest to highest
export const getCheaperPlan = (planType: PlanType, planList: any[]) => {
  const cheaperPlan = filterPlansByType(planType, planList).sort(compareByFee);
  return cheaperPlan[0];
};

export const getPotentialUpgrades = (userPlan: Plan, planList: Plan[]): Plan[] => {
  switch (userPlan.type) {
    case PLAN_TYPE.free:
      return planList;

    case PLAN_TYPE.byCredit:
      return [
        ...getPotentialUpgradesContactsPlansFromCredits(planList, {
          minSubscriberLimit: userPlan.subscribersCount,
        }),
        ...filterPlansByType(PLAN_TYPE.byEmail, planList),
        ...filterPlansByType(PLAN_TYPE.byCredit, planList),
      ];

    case PLAN_TYPE.byEmail:
      return [
        ...getPotentialUpgradesPlansByEmail(planList, {
          minFee: userPlan.fee,
          minEmailsByMonth: userPlan.emailsByMonth,
        }),
      ];

    case PLAN_TYPE.byContact:
      return [
        ...getPotentialUpgradesPlansByContact(planList, {
          minFee: userPlan.fee,
          minSubscriberLimit: userPlan.subscriberLimit,
        }),
      ];
    default:
      return [];
  }
};

export const getPotentialUpgradesPlansByEmail = (
  planList: Plan[],
  { minFee, minEmailsByMonth }: { minFee: number; minEmailsByMonth: number } = {
    minFee: 0,
    minEmailsByMonth: 0,
  },
): EmailPlan[] =>
  planList.filter(
    (plan) =>
      plan.type === PLAN_TYPE.byEmail &&
      plan.fee >= minFee &&
      plan.emailsByMonth >= minEmailsByMonth,
  ) as EmailPlan[];

export const getPotentialUpgradesPlansByContact = (
  planList: Plan[],
  { minFee, minSubscriberLimit }: { minFee: number; minSubscriberLimit: number } = {
    minFee: 0,
    minSubscriberLimit: 0,
  },
): ContactPlan[] =>
  planList.filter(
    (plan) =>
      plan.type === PLAN_TYPE.byContact &&
      plan.fee >= minFee &&
      plan.subscriberLimit >= minSubscriberLimit,
  ) as ContactPlan[];

const compareByFee = (previousPlan: Plan, nextPlan: Plan): number => {
  const priceOfPreviousPlan = getPlanFee(previousPlan);
  const priceOfNextPlan = getPlanFee(nextPlan);

  return priceOfPreviousPlan < priceOfNextPlan ? -1 : priceOfPreviousPlan > priceOfNextPlan ? 1 : 0;
};

export const getPotentialUpgradesContactsPlansFromCredits = (
  planList: Plan[],
  { minSubscriberLimit }: { minSubscriberLimit: number } = {
    minSubscriberLimit: 0,
  },
): ContactPlan[] =>
  planList.filter(
    (plan) => plan.type === PLAN_TYPE.byContact && plan.subscriberLimit >= minSubscriberLimit,
  ) as ContactPlan[];
