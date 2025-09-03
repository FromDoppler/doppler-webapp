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

export const SUBSCRIBERS_LIMIT_EXCLUSIVE_DISCOUNT_ARGENTINA = 10000;
export const EXCLUSIVE_DISCOUNT_PERCENTAGE_ARGENTINA = 20;

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

export const MAX_LANDING_PACKAGE = 10;

export type PlanType = typeof PLAN_TYPE[keyof typeof PLAN_TYPE];

export type PaymentType = 'CC' | 'transfer';

export type BillingCycle = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export type Path = FreePath | StandardPath | PlusPath | AgenciesPath;

export interface AdvancePayOptions {
  id: number;
  paymentType: 'CC' | 'transfer';
  discountPercentage: number;
  billingCycle: BillingCycle;
  applyPromo: boolean;
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
  subscribersQty?: number;
  fee: number;
  billingCycleDetails: AdvancePayOptions[];
  currentSubscription: number;
}

export interface EmailPlan {
  type: 'monthly-deliveries';
  id: number;
  name: string;
  emailsByMonth: number;
  emailQty?: number;
  extraEmailPrice: number;
  fee: number;
}

export interface CreditPlan {
  type: 'prepaid';
  id: number;
  name: string;
  credits: number;
  emailQty?: number;
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

export const AutomaticDebitError = {
  cbuInvalid: 'CbuInvalid',
};

export const OnlySupportUpSelling = 'Invalid selected plan. Only supports upselling.';

export const nonAuthenticatedBlockedUser = 'non-authenticated-blocked-user';

export const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const paymentFrequenciesListFake = [
  {
    numberMonths: 12,
    subscriptionType: 'yearly',
    discountPercentage: 25,
  },
  {
    numberMonths: 6,
    subscriptionType: 'half_yearly',
    discountPercentage: 15,
  },
  {
    numberMonths: 3,
    subscriptionType: 'quarterly',
    discountPercentage: 5,
  },
  {
    numberMonths: 1,
    subscriptionType: 'monthly',
    discountPercentage: 0,
  },
];

export const BUY_MARKETING_PLAN = 1;
export const BUY_LANDING_PACK = 3;
export const BUY_CHAT_PLAN = 2;
export const BUY_ONSITE_PLAN = 4;
export const BUY_PUSH_NOTIFICATION_PLAN = 5;

export const AddOnType = {
  Conversations: 1,
  Landings: 2,
  OnSite: 3,
  PushNotifications: 4
};

export const AccountCancellationFlow = {
  free: 1,
  greaterOrEqual1000ContactsOrMonthly: 2,
  lessOrEqual5000ContactsOrCredits: 3,
};

export interface PushNotificationSettings {
  consumedSends: number;
  trialPeriodRemainingDays: number;
  isPushServiceEnabled: boolean;
};

export const PUSH_NOTIFICATION_PLAN_TRIAL_ID = 1;