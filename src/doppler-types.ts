export type UnexpectedError =
  | { success?: false; value?: any }
  | { success?: false; [key: string]: any };
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

export type PathType = 'free' | 'standard' | 'plus' | 'agencies';

export const PLAN_TYPE = {
  free: 'free',
  byCredit: 'prepaid',
  byEmail: 'monthly-deliveries',
  byContact: 'subscribers',
  agencies: 'agencies',
} as const;

export const URL_PLAN_TYPE = {
  [PLAN_TYPE.byContact]: 'by-contacts',
  [PLAN_TYPE.byEmail]: 'by-emails',
  [PLAN_TYPE.byCredit]: 'by-credits',
} as const;

export const SUBSCRIPTION_TYPE = {
  monthly: 'monthly',
  quarterly: 'quarterly',
  biyearly: 'half-yearly',
  yearly: 'yearly',
} as const;

export type PlanType = typeof PLAN_TYPE[keyof typeof PLAN_TYPE];

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

export interface ContactPlan {
  type: 'subscribers';
  id: number;
  name: string;
  subscriberLimit: number;
  fee: number;
  billingCycleDetails: AdvancePayOptions[];
  currentSubscription: number;
}

export interface EmailPlan {
  type: 'monthly-deliveries';
  id: number;
  name: string;
  emailsByMonth: number;
  extraEmailPrice: number;
  fee: number;
}

export interface CreditPlan {
  type: 'prepaid';
  id: number;
  name: string;
  credits: number;
  price: number;
  subscribersCount: number;
}

export interface FreePlan {
  type: 'free';
  subscriberLimit: number;
}

export interface AgenciesPlan {
  type: 'agencies';
}

export interface FreePath {
  type: 'free';
  current: boolean;
}

export type Plan = ContactPlan | FreePlan | CreditPlan | EmailPlan | AgenciesPlan;

export type FeaturedPlan = ContactPlan | EmailPlan;

export interface StandardPath {
  type: 'standard';
  current: boolean;
  minimumFee: number;
}

export interface PlusPath {
  type: 'plus';
  current: boolean;
  minimumFee: number;
}

export interface AgenciesPath {
  type: 'agencies';
  current: boolean;
}

export interface AppStatus {
  offline: boolean;
}

export type IntegrationStatus = 'connected' | 'disconnected' | 'alert';

export const PaymentMethodType = {
  creditCard: 'CC',
  mercadoPago: 'MP',
  transfer: 'TRANSF',
  automaticDebit: 'DA',
};

export const FirstDataError = {
  invalidExpirationDate: 'DeclinedPaymentTransaction - Invalid Expiration Date [Bank]',
  invalidCreditCardNumber: 'DeclinedPaymentTransaction - Invalid Credit Card Number',
  invalidCCNumber: 'DeclinedPaymentTransaction - Invalid CC Number [Bank]',
  declined: 'DeclinedPaymentTransaction - Declined [Bank]',
  doNotHonorDeclined: 'DoNotHonorPaymentResponse - Processor Decline [Bank]',
  suspectedFraud: 'DeclinedPaymentTransaction - Suspected Fraud [Bank]',
  insufficientFunds: 'DeclinedPaymentTransaction - Insufficient Funds [Bank]',
  cardVolumeExceeded: 'DeclinedPaymentTransaction - Card Volume Exceeded',
  doNotHonor: 'DoNotHonorPaymentResponse - Do Not Honor [Bank]',
};

export const MercadoPagoError = {
  invalidExpirationDate: 'DeclinedPaymentTransaction - cc_rejected_bad_filled_date',
  invalidSecurityCode: 'DeclinedPaymentTransaction - cc_rejected_bad_filled_security_code',
  insufficientFunds: 'DeclinedPaymentTransaction - cc_rejected_insufficient_amount',
  declinedOtherReason: 'DeclinedPaymentTransaction - cc_rejected_other_reason',
  suspectedFraud: 'DeclinedPaymentTransaction - cc_rejected_high_risk',
  pending: 'Pending',
};

export const CloverError = {
  declined: 'DeclinedPaymentTransaction - card_declined',
  invalidCreditCardNumber: 'DeclinedPaymentTransaction - invalid_number',
  invalidExpirationMonth: 'DeclinedPaymentTransaction - invalid_expiry_month',
  invalidExpirationYear: 'DeclinedPaymentTransaction - invalid_expiry_year',
  invalidSecurityCode: 'DeclinedPaymentTransaction - incorrect_cvc"',
  insufficientFunds: 'DeclinedPaymentTransaction - invalid_tip_amount',
  invalidExpirationCard: 'DeclinedPaymentTransaction - expired_card',
};

export const OnlySupportUpSelling = 'Invalid selected plan. Only supports upselling.';

export const nonAuthenticatedBlockedUser = 'non-authenticated-blocked-user';
