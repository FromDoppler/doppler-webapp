export type UnexpectedError = { success?: false } | { success?: false; [key: string]: any };
export type ErrorResult<TError> = { success?: false; expectedError: TError } | UnexpectedError;
export type Result<TResult, TError> = { success: true; value: TResult } | ErrorResult<TError>;
export type ResultWithoutExpectedErrors<TResult> =
  | { success: true; value: TResult }
  | UnexpectedError;
export type EmptyResult<TError> = { success: true } | ErrorResult<TError>;
// It does not work:
// type EmptyResult = { success: true } | UnexpectedError;
// Duplicate identifier 'EmptyResult'.ts(2300)
// TODO: Research how to fix it and rename EmptyResultWithoutExpectedErrors as EmptyResult
export type EmptyResultWithoutExpectedErrors = { success: true } | UnexpectedError;

export enum FeatureSet {
  free = 'free',
  small = 'standard',
  full = 'plus',
  agencies = 'agencies',
}

export enum PlanTypeSet {
  free = 'free',
  byCredits = 'prepaid',
  byEmails = 'monthly-deliveries',
  byContacts = 'subscribers',
  agencies = 'agencies',
  demo = 'demo',
}

export type PathType = FeatureSet;

export type PlanType = PlanTypeSet;

export type PaymentType = 'CC' | 'transfer';

export type BillingCycle = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export type Path = FreePath | StandardPath | PlusPath | AgenciesPath;

export interface AdvancePayOptions {
  id: number;
  paymentType: 'CC' | 'transfer';
  discountPercentage: number;
  billingCycle: BillingCycle;
}

export type Features =
  | 'emailParameter'
  | 'cancelCampaign'
  | 'siteTracking'
  | 'smartCampaigns'
  | 'shippingLimit';

export interface SubscribersLimitedPlan {
  type: PlanTypeSet.byContacts;
  id: number;
  name: string;
  subscriberLimit: number;
  fee: number;
  featureSet: FeatureSet.small | FeatureSet.full;
  featureList: Features[];
  billingCycleDetails: AdvancePayOptions[];
  currentSubscription: number;
}

export interface MonthlyRenewalDeliveriesPlan {
  type: PlanTypeSet.byEmails;
  id: number;
  name: string;
  emailsByMonth: number;
  extraEmailPrice: number;
  fee: number;
  featureSet: FeatureSet.small | FeatureSet.full;
  featureList: Features[];
}

export interface PrepaidPack {
  type: PlanTypeSet.byCredits;
  id: number;
  name: string;
  credits: number;
  price: number;
  subscribersCount: number;
  featureSet: FeatureSet.small;
}

export interface FreePlan {
  type: PlanTypeSet.free;
  subscriberLimit: number;
  featureSet: FeatureSet.free;
}

export interface AgencyPlan {
  type: PlanTypeSet.agencies;
  featureSet: FeatureSet.agencies;
}

export interface FreePath {
  type: FeatureSet.free;
  current: boolean;
}

export type Plan =
  | SubscribersLimitedPlan
  | FreePlan
  | PrepaidPack
  | MonthlyRenewalDeliveriesPlan
  | AgencyPlan;

export type FeaturedPlan = SubscribersLimitedPlan | MonthlyRenewalDeliveriesPlan;

export interface StandardPath {
  type: FeatureSet.small;
  current: boolean;
  minimumFee: number;
}

export interface PlusPath {
  type: FeatureSet.full;
  current: boolean;
  minimumFee: number;
}

export interface AgenciesPath {
  type: FeatureSet.agencies;
  current: boolean;
}

export interface AppStatus {
  offline: boolean;
}
