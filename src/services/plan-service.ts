import { DopplerLegacyClient } from './doppler-legacy-client';
import {
  FreePath,
  StandardPath,
  PlusPath,
  AgenciesPath,
  PlanType,
  Plan,
  PathType,
  Path,
  PrepaidPack,
  MonthlyRenewalDeliveriesPlan,
  SubscribersLimitedPlan,
  FreePlan,
  AgencyPlan,
} from '../doppler-types';
import { getPlanFee } from '../utils';

export interface PlanHierarchy {
  getPaths(userPlan: Plan, planList: Plan[]): Path[];
  // current plan free: FreePath, StandardPath, PlusPath, AgenciesPath
  // current plan by credits: StandardPath, PlusPath, AgenciesPath
  // current plan standard: StandardPath, PlusPath, AgenciesPath
  // current plan plus: PlusPath, AgenciesPath

  getPlanTypes(userPlan: Plan, pathType: PathType, planList: Plan[]): PlanType[];
  // get all plan types to be listed in slider: monthly-deliveries | subscribers | prepaid
  // Free and select standard -->'PrepaidPack' | 'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan'
  // Free and select plus --> 'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan'
  // By credits -->  'PrepaidPack' | 'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan' (we should confirm this option)
  // Standard and select standard (up contacts or up deliveries option) --> 'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan'
  // Standard and select plus --> 'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan'
  // plus and select plus (up contacts or up deliveries option) -->  'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan'

  getPlans(userPlan: Plan, pathType: PathType, planType: PlanType, planList: Plan[]): Plan[];
  // this method is to actually get a plans array with all options to show in slider, in this method we must ensure to call BE once
}

const getPrepaidPacks = (planList: Plan[]): PrepaidPack[] =>
  planList.filter((x) => x.type === 'prepaid') as PrepaidPack[];

const getUpgradeMonthlyPlans = (
  planList: Plan[],
  { minFee, minEmailsByMonth }: { minFee: number; minEmailsByMonth: number } = {
    minFee: 0,
    minEmailsByMonth: 0,
  },
): MonthlyRenewalDeliveriesPlan[] =>
  planList.filter(
    (x) => x.type === 'monthly-deliveries' && x.fee > minFee && x.emailsByMonth >= minEmailsByMonth,
  ) as MonthlyRenewalDeliveriesPlan[];

const getUpgradeSubscribersPlans = (
  planList: Plan[],
  { minFee, minSubscriberLimit }: { minFee: number; minSubscriberLimit: number } = {
    minFee: 0,
    minSubscriberLimit: 0,
  },
): SubscribersLimitedPlan[] =>
  planList.filter(
    (x) => x.type === 'subscribers' && x.fee > minFee && x.subscriberLimit >= minSubscriberLimit,
  ) as SubscribersLimitedPlan[];

const getFreePlans = (planList: Plan[]): FreePlan[] =>
  planList.filter((x) => x.type === 'free') as FreePlan[];

const getAgencyPlans = (planList: Plan[]): AgencyPlan[] =>
  planList.filter((x) => x.type === 'agency') as AgencyPlan[];

const getStandardPlans = (
  planList: Plan[],
): (MonthlyRenewalDeliveriesPlan | SubscribersLimitedPlan | PrepaidPack)[] =>
  planList.filter((x) => x.featureSet === 'standard') as (
    | MonthlyRenewalDeliveriesPlan
    | SubscribersLimitedPlan
    | PrepaidPack
  )[];

const getPlusPlans = (
  planList: Plan[],
): (MonthlyRenewalDeliveriesPlan | SubscribersLimitedPlan)[] =>
  planList.filter((x) => x.featureSet === 'plus') as (
    | MonthlyRenewalDeliveriesPlan
    | SubscribersLimitedPlan
  )[];

const getFreePathOrEmpty = (userPlan: Plan, planList: Plan[]): [] | [FreePath] => {
  var plans = getFreePlans(planList);

  if (plans.length === 0) {
    return [];
  }

  var cheapestPlan = plans[0];

  return [
    {
      type: 'free',
      current: userPlan.featureSet === 'free',
      deadEnd: plans.length === 1 && userPlan === cheapestPlan,
    },
  ];
};

const getAgencyPathOrEmpty = (userPlan: Plan, planList: Plan[]): [] | [AgenciesPath] => {
  var plans = getAgencyPlans(planList);

  if (plans.length === 0) {
    return [];
  }

  var cheapestPlan = plans[0];

  return [
    {
      type: 'agencies',
      current: userPlan.featureSet === 'agency',
      deadEnd: plans.length === 1 && userPlan === cheapestPlan,
    },
  ];
};

const getStandardPathOrEmpty = (userPlan: Plan, planList: Plan[]): [] | [StandardPath] => {
  var plans = getStandardPlans(planList).sort(compareByFee);
  if (plans.length === 0) {
    return [];
  }

  var cheapestPlan = plans[0];

  return [
    {
      type: 'standard',
      current: userPlan.featureSet === 'standard',
      minimumFee: getPlanFee(cheapestPlan),
      deadEnd: plans.length === 1 && cheapestPlan === userPlan,
    },
  ];
};

const getPlusPathOrEmpty = (userPlan: Plan, planList: Plan[]): PlusPath[] => {
  var plans = getPlusPlans(planList).sort(compareByFee);

  if (plans.length === 0) {
    return [];
  }

  var cheapestPlan = plans[0];

  return [
    {
      type: 'plus',
      current: userPlan.featureSet === 'plus',
      minimumFee: cheapestPlan.fee,
      deadEnd: plans.length === 1 && cheapestPlan === userPlan,
    },
  ];
};

const _agencyPlan: AgencyPlan = {
  type: 'agency',
  featureSet: 'agency',
};

const getPotentialUpgrades = (userPlan: Plan, planList: Plan[]): Plan[] => {
  const potentialUpgradePlans =
    userPlan.type === 'free'
      ? planList
      : userPlan.type === 'prepaid'
      ? [
          ...getPrepaidPacks(planList),
          ...getUpgradeMonthlyPlans(planList),
          ...getUpgradeSubscribersPlans(planList),
        ]
      : userPlan.type === 'monthly-deliveries'
      ? getUpgradeMonthlyPlans(planList, {
          minFee: userPlan.fee,
          minEmailsByMonth: userPlan.emailsByMonth,
        })
      : userPlan.type === 'subscribers'
      ? [
          ...getUpgradeSubscribersPlans(planList, {
            minFee: userPlan.fee,
            minSubscriberLimit: userPlan.subscriberLimit,
          }),
          ...getUpgradeMonthlyPlans(planList, {
            minFee: userPlan.fee,
            minEmailsByMonth: 0,
          }),
        ]
      : [];
  // if the plan is plus featured we won´t need any standard plan
  const potentialUpgradePlansFilteredByFeatures =
    userPlan.featureSet === 'plus' ? getPlusPlans(potentialUpgradePlans) : potentialUpgradePlans;
  return potentialUpgradePlansFilteredByFeatures;
};

function compareByFee(left: Plan, right: Plan): number {
  return getPlanFee(left) < getPlanFee(right) ? -1 : getPlanFee(left) > getPlanFee(right) ? 1 : 0;
}

export class PlanService implements PlanHierarchy {
  private PlanList: Plan[] = [];
  private readonly dopplerLegacyClient: DopplerLegacyClient;

  constructor({ dopplerLegacyClient }: { dopplerLegacyClient: DopplerLegacyClient }) {
    this.dopplerLegacyClient = dopplerLegacyClient;
  }

  async getPlanList(): Promise<Plan[]> {
    return this.PlanList.length
      ? this.PlanList
      : (this.PlanList = await this.dopplerLegacyClient.getAllPlans());
  }

  getPaths(userPlan: Plan, planList: Plan[]): Path[] {
    const potentialUpgradePlans = getPotentialUpgrades(userPlan, planList);
    const potentialAndCurrentPlans = [userPlan, ...potentialUpgradePlans, _agencyPlan];

    return [
      ...getFreePathOrEmpty(userPlan, potentialAndCurrentPlans),
      ...getStandardPathOrEmpty(userPlan, potentialAndCurrentPlans),
      ...getPlusPathOrEmpty(userPlan, potentialAndCurrentPlans),
      ...getAgencyPathOrEmpty(userPlan, potentialAndCurrentPlans),
    ];
  }

  getPlanTypes(userPlan: Plan, pathType: PathType, planList: Plan[]): PlanType[] {
    const potentialUpgradePlans = getPotentialUpgrades(userPlan, planList);
    const potentialUpgradePlansFilteredByPath =
      pathType === 'plus'
        ? getPlusPlans(potentialUpgradePlans)
        : pathType === 'standard'
        ? getStandardPlans(potentialUpgradePlans)
        : [];

    if (potentialUpgradePlansFilteredByPath.length === 0) return [];

    const typesAllowed: PlanType[] = potentialUpgradePlansFilteredByPath.map((plan) => plan.type);
    const distinctTypesAllowed: PlanType[] = typesAllowed.filter(
      (n, i) => typesAllowed.indexOf(n) === i,
    );

    return distinctTypesAllowed;
  }

  getPlans(userPlan: Plan, pathType: PathType, planType: PlanType, planList: Plan[]): Plan[] {
    const potentialUpgradePlans = getPotentialUpgrades(userPlan, planList);
    const potentialUpgradePlansFilteredByPath =
      pathType === 'plus'
        ? getPlusPlans(potentialUpgradePlans)
        : pathType === 'standard'
        ? getStandardPlans(potentialUpgradePlans)
        : [];
    const potentialUpgradePlansFilteredByPathAndType = potentialUpgradePlansFilteredByPath.filter(
      (plan) => plan.type === planType,
    );

    const potentialUpgradePlansFilteredByPathAndTypeSorted = potentialUpgradePlansFilteredByPathAndType.sort(
      compareByFee,
    );
    return potentialUpgradePlansFilteredByPathAndTypeSorted;
  }

  getPlanBySessionPlanId(id: number, planList: Plan[]) {
    return (planList as (
      | PrepaidPack
      | MonthlyRenewalDeliveriesPlan
      | SubscribersLimitedPlan
    )[]).find((plan) => plan.id === id);
  }

  getCheapestPrepaidPlan(planList: Plan[]) {
    const prepaidPlans = getPrepaidPacks(planList).sort(compareByFee);
    return prepaidPlans[0];
  }
}
