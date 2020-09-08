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
  getPaths(userPlan: Plan, planList: Plan[]): Promise<Path[]>;
  // current plan free: FreePath, StandardPath, PlusPath, AgenciesPath
  // current plan by credits: StandardPath, PlusPath, AgenciesPath
  // current plan standard: StandardPath, PlusPath, AgenciesPath
  // current plan plus: PlusPath, AgenciesPath

  getPlanTypes(userPlan: Plan, pathType: PathType): PlanType[];
  // get all plan types to be listed in slider: monthly-deliveries | subscribers | prepaid
  // Free and select standard -->'PrepaidPack' | 'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan'
  // Free and select plus --> 'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan'
  // By credits -->  'PrepaidPack' | 'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan' (we should confirm this option)
  // Standard and select standard (up contacts or up deliveries option) --> 'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan'
  // Standard and select plus --> 'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan'
  // plus and select plus (up contacts or up deliveries option) -->  'MonthlyRenewalDeliveriesPlan' | 'SubscribersLimitedPlan'

  getPlans(userPlan: Plan, pathType: PathType, planType: PlanType): Plan[];
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
): (MonthlyRenewalDeliveriesPlan | SubscribersLimitedPlan)[] =>
  planList.filter((x) => x.featureSet === 'standard') as (
    | MonthlyRenewalDeliveriesPlan
    | SubscribersLimitedPlan
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
      actual: userPlan.featureSet === 'free',
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
      actual: userPlan.featureSet === 'agency',
      deadEnd: plans.length === 1 && userPlan === cheapestPlan,
    },
  ];
};

const getStandardPathOrEmpty = (userPlan: Plan, planList: Plan[]): [] | [StandardPath] => {
  var plans = getStandardPlans(planList).sort((x) => getPlanFee(x));

  if (plans.length === 0) {
    return [];
  }

  var cheapestPlan = plans[0];

  return [
    {
      type: 'standard',
      actual: userPlan.featureSet === 'standard',
      minimumFee: getPlanFee(cheapestPlan),
      deadEnd: plans.length === 1 && cheapestPlan === userPlan,
    },
  ];
};

const getPlusPathOrEmpty = (userPlan: Plan, planList: Plan[]): PlusPath[] => {
  var plans = getPlusPlans(planList).sort((x) => x.fee);

  if (plans.length === 0) {
    return [];
  }

  var cheapestPlan = plans[0];

  return [
    {
      type: 'plus',
      actual: userPlan.featureSet === 'plus',
      minimumFee: cheapestPlan.fee,
      deadEnd: plans.length === 1 && cheapestPlan === userPlan,
    },
  ];
};

const _agencyPlan: AgencyPlan = {
  type: 'agency',
  featureSet: 'agency',
};

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

  async getPaths(userPlan: Plan, planList: Plan[]): Promise<Path[]> {
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
        ? getUpgradeSubscribersPlans(planList, {
            minFee: userPlan.fee,
            minSubscriberLimit: userPlan.subscriberLimit,
          })
        : [];
    // if the plan is plus featured we won´t need any standard plan
    const potentialUpgradePlansFilteredByFeatures =
      userPlan.featureSet === 'plus' ? getPlusPlans(potentialUpgradePlans) : potentialUpgradePlans;
    const potentialAndCurrentPlans = [
      userPlan,
      ...potentialUpgradePlansFilteredByFeatures,
      _agencyPlan,
    ];

    return [
      ...getFreePathOrEmpty(userPlan, potentialAndCurrentPlans),
      ...getStandardPathOrEmpty(userPlan, potentialAndCurrentPlans),
      ...getPlusPathOrEmpty(userPlan, potentialAndCurrentPlans),
      ...getAgencyPathOrEmpty(userPlan, potentialAndCurrentPlans),
    ];
  }

  getPlanTypes(userPlan: Plan, pathType: PathType): PlanType[] {
    throw new Error('Not implemented');
  }

  getPlans(userPlan: Plan, pathType: PathType, planType: PlanType): Plan[] {
    throw new Error('Not implemented');
  }
}
