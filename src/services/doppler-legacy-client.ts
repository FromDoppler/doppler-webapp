import { AxiosInstance, AxiosStatic, AxiosError } from 'axios';
import { Property } from 'csstype';
import { Result, EmptyResult, EmptyResultWithoutExpectedErrors } from '../doppler-types';
import axiosRetry from 'axios-retry';
import { addLogEntry, logAxiosRetryError } from '../utils';
import {
  AdvancePayOptions,
  PaymentType,
  PlanType,
  BillingCycle,
  PathType,
  Plan,
} from '../doppler-types';
import jwt_decode from 'jwt-decode';

export interface DopplerLegacyClient {
  getUserData(): Promise<DopplerLegacyUserData>;
  getUpgradePlanData(isSubscriberPlan: boolean): Promise<DopplerLegacyClientTypePlan[]>;
  login(loginModel: LoginModel): Promise<LoginResult>;
  sendEmailUpgradePlan(planModel: DopplerLegacyUpgradePlanContactModel): Promise<void>;
  registerUser(userRegistrationModel: UserRegistrationModel): Promise<UserRegistrationResult>;
  resendRegistrationEmail(resendRegistrationModel: ResendRegistrationModel): Promise<void>;
  activateSiteTrackingTrial(): Promise<ActivateSiteTrackingTrialResult>;
  sendResetPasswordEmail(forgotPasswordModel: ForgotPasswordModel): Promise<ForgotPasswordResult>;
  getAllPlans(): Promise<Plan[]>;
  requestAgenciesDemo(
    requestAgenciesDemoModel: RequestAgenciesDemoModel,
  ): Promise<RequestAgenciesDemoResult>;
  isDopplerMVCUp(): Promise<boolean>;
  requestExclusiveFeaturesDemo(
    requestExclusiveFeaturesDemoModel: RequestExclusiveFeaturesDemoModel,
  ): Promise<RequestExclusiveFeaturesDemoResult>;
}

interface PayloadWithCaptchaToken {
  captchaResponseToken: string;
}

/* #region Forgot Password data types */

export interface ForgotPasswordModel extends PayloadWithCaptchaToken {
  email: string;
}

export interface RequestAgenciesDemoModel {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  range_time: string;
  volume: string;
}

export interface RequestExclusiveFeaturesDemoModel {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  range_time: string;
  features: string;
}

export type ForgotPasswordResult = EmptyResultWithoutExpectedErrors;

export type RequestAgenciesDemoResult = EmptyResultWithoutExpectedErrors;

export type RequestExclusiveFeaturesDemoResult = EmptyResultWithoutExpectedErrors;

export type ActivateSiteTrackingTrialResult = EmptyResultWithoutExpectedErrors;

/* #endregion */

/* #region Login data types */

export type LoginErrorResult =
  | {
      blockedAccountNotPayed: true;
      accountNotValidated?: false;
      cancelatedAccount?: false;
      blockedAccountInvalidPassword?: false;
      invalidLogin?: false;
      maxLoginAttempts?: false;
      wrongCaptcha?: false;
      blockedAccountCMDisabled?: false;
      errorMessage?: string;
    }
  | {
      accountNotValidated: true;
      cancelatedAccount?: false;
      blockedAccountNotPayed?: false;
      blockedAccountInvalidPassword?: false;
      invalidLogin?: false;
      maxLoginAttempts?: false;
      wrongCaptcha?: false;
      blockedAccountCMDisabled?: false;
      errorMessage?: string;
    }
  | {
      cancelatedAccount: true;
      blockedAccountNotPayed?: false;
      accountNotValidated?: false;
      blockedAccountInvalidPassword?: false;
      invalidLogin?: false;
      maxLoginAttempts?: false;
      wrongCaptcha?: false;
      blockedAccountCMDisabled?: false;
      errorMessage?: string;
    }
  | {
      blockedAccountInvalidPassword: true;
      blockedAccountNotPayed?: false;
      accountNotValidated?: false;
      cancelatedAccount?: false;
      invalidLogin?: false;
      maxLoginAttempts?: false;
      wrongCaptcha?: false;
      blockedAccountCMDisabled?: false;
      errorMessage?: string;
    }
  | {
      invalidLogin: true;
      blockedAccountInvalidPassword?: false;
      blockedAccountNotPayed?: false;
      accountNotValidated?: false;
      cancelatedAccount?: false;
      maxLoginAttempts?: false;
      wrongCaptcha?: false;
      blockedAccountCMDisabled?: false;
      errorMessage?: string;
    }
  | {
      blockedAccountInvalidPassword: true;
      blockedAccountNotPayed?: false;
      accountNotValidated?: false;
      cancelatedAccount?: false;
      invalidLogin?: false;
      maxLoginAttempts: true;
      wrongCaptcha?: false;
      blockedAccountCMDisabled?: false;
      errorMessage?: string;
    }
  | {
      blockedAccountInvalidPassword: true;
      blockedAccountNotPayed?: false;
      accountNotValidated?: false;
      cancelatedAccount?: false;
      invalidLogin?: false;
      maxLoginAttempts: true;
      wrongCaptcha?: true;
      blockedAccountCMDisabled?: false;
      errorMessage?: string;
    }
  | {
      blockedAccountInvalidPassword?: false;
      blockedAccountNotPayed?: false;
      accountNotValidated?: false;
      cancelatedAccount?: false;
      invalidLogin?: false;
      maxLoginAttempts?: false;
      wrongCaptcha?: false;
      blockedAccountCMDisabled: true;
      errorMessage: string;
    };

export type LoginResult = Result<{ redirectUrl?: string }, LoginErrorResult>;

export interface LoginModel extends PayloadWithCaptchaToken {
  username: string;
  password: string;
}

function removeErrorCodeFromExceptionMessage(errorCode: string, message: string) {
  return message.search(errorCode) !== -1 ? message.substring(errorCode.length) : message;
}

/* #endregion */

/* #region Registration data types */

type UserRegistrationErrorResult =
  | { emailAlreadyExists: true; blockedDomain?: false; registerDenied?: false }
  | { emailAlreadyExists?: false; blockedDomain: true; registerDenied?: false }
  | { emailAlreadyExists?: false; blockedDomain?: false; registerDenied: true };

export type UserRegistrationResult = EmptyResult<UserRegistrationErrorResult>;

export interface UserRegistrationModel extends PayloadWithCaptchaToken {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  accept_privacy_policies: boolean;
  accept_promotions: boolean;
  firstOrigin?: string;
  origin: string;
  language: string;
  redirect?: string;
}

export interface ResendRegistrationModel extends PayloadWithCaptchaToken {
  email: string;
}

/* #endregion */

/* #region DopplerLegacyUserData data types */
interface NavEntry {
  isSelected: boolean;
  title: string;
  url: string;
  idHTML: string;
}

interface SubNavEntry extends NavEntry {}

interface MainNavEntry extends NavEntry {
  subNav: SubNavEntry[];
}

interface PlanEntry {
  buttonText: string;
  buttonUrl: string;
  description: string;
  isMonthlyByEmail: boolean;
  isSubscribers: boolean;
  itemDescription: string;
  maxSubscribers: number;
  pendingFreeUpgrade: boolean;
  planName: string;
  remainingCredits: number;
  isFreeAccount: boolean;
  planType: PlanType;
  idPlan: number;
}

interface SmsEntry {
  buttonText: string;
  buttonUrl: string;
  description: string;
  remainingCredits: number;
}

interface AvatarEntry {
  color: Property.Color;
  text: string;
}

interface UserEntry {
  idUser: number;
  avatar: AvatarEntry;
  email: string;
  fullname: string;
  hasClientManager: boolean;
  lang: string;
  nav: NavEntry[];
  plan: PlanEntry;
}

interface AlertEntry {
  button: {
    text: string;
    url: string;
  };
  message: string;
  type: string;
}

interface DopplerFeatures {
  /** Site tracking trial accepted or not */
  siteTrackingEnabled: boolean;
  /** Site tracking feature active or disabled */
  siteTrackingActive: boolean;
  emailParameterEnabled: boolean;
  emailParameterActive: boolean;
}

export interface DopplerLegacyUserData {
  alert: AlertEntry | undefined;
  nav: MainNavEntry[];
  user: UserEntry;
  jwtToken: string;
  notifications: string[];
  emptyNotificationText: string;
  datahubCustomerId: string | null;
  features: DopplerFeatures;
}

//TODO: remove this type in favor of plan hierarchy
export interface DopplerLegacyClientTypePlan {
  IdUserTypePlan: number;
  Description: string;
}

//TODO: remove this type in favor of plan hierarchy
export interface DopplerLegacyUpgradePlanContactModel {
  Detail: string;
  IdClientTypePlanSelected: number;
}

// dictionaries
export const planTypeByIdUserType: { [idUserType: number]: PlanType } = {
  1: 'free',
  2: 'monthly-deliveries',
  3: 'prepaid',
  4: 'subscribers',
  5: 'agencies',
  6: 'agencies',
  7: 'free',
  8: 'agencies',
};

export const pathTypeByType: { [type: number]: PathType } = {
  1: 'free',
  2: 'standard',
  3: 'plus',
};

export const paymentTypeByPaymentMethod: { [paymentMehtod: number]: PaymentType } = {
  1: 'CC',
  3: 'transfer',
};

export const monthPlanByBillingCycle: { [paymentMehtod: number]: BillingCycle } = {
  1: 'monthly',
  3: 'quarterly',
  6: 'half-yearly',
  12: 'yearly',
};
// end dictionaries
/* #endregion */

/* #region DopplerLegacyUserData mappings */
function mapPlanEntry(json: any): PlanEntry {
  return {
    buttonText: json.buttonText,
    buttonUrl: json.buttonUrl,
    description: json.description,
    isMonthlyByEmail: (json.isMonthlyByEmail && JSON.parse(json.isMonthlyByEmail)) || false,
    isSubscribers: (json.isSubscribers && JSON.parse(json.isSubscribers)) || false,
    itemDescription: json.itemDescription,
    maxSubscribers: (json.maxSubscribers && JSON.parse(json.maxSubscribers)) || 0,
    pendingFreeUpgrade: (json.pendingFreeUpgrade && JSON.parse(json.pendingFreeUpgrade)) || false,
    planName: json.planName,
    remainingCredits: (json.remainingCredits && JSON.parse(json.remainingCredits)) || 0,
    isFreeAccount:
      json.planType === 1 || json.planType === 7 || json.planType === '1' || json.planType === '7',
    planType: planTypeByIdUserType[json.planType],
    idPlan: json.idUserTypePlan ? json.idUserTypePlan : 0,
  };
}
function mapSmsEntry(json: any): SmsEntry {
  return {
    buttonText: json.buttonText,
    buttonUrl: json.buttonUrl,
    description: json.description,
    remainingCredits: (json.remainingCredits && JSON.parse(json.remainingCredits)) || 0,
  };
}

function mapNavEntry(json: any): NavEntry {
  return {
    isSelected: json.isSelected,
    title: json.title,
    url: json.url,
    idHTML: json.idHTML,
  };
}

function mapNavMainEntry(json: any): MainNavEntry {
  return {
    ...mapNavEntry(json),
    subNav: (json.subNav && json.subNav.map(mapNavEntry)) || [],
  };
}

function sanitizePlans(json: any): any {
  return json.length ? json.filter((rawPlan: any) => rawPlan.Fee) : [];
}

function mapAdvancePay(json: any): AdvancePayOptions {
  return {
    id: json.IdDiscountPlan,
    paymentType: paymentTypeByPaymentMethod[json.IdPaymentMethod],
    discountPercentage: json.DiscountPlanFee,
    billingCycle: monthPlanByBillingCycle[json.MonthPlan],
  };
}

function parsePlan(json: any) {
  const id = json.IdUserTypePlan;
  const fee = json.Fee;
  const featureSet = pathTypeByType[json.PlanType];
  const type = planTypeByIdUserType[json.IdUserType];
  const emailsByMonth = json.EmailQty;
  const subscriberLimit = json.SubscribersQty;
  const extraEmailPrice = json.ExtraEmailCost;
  const features = [];
  json.EmailParameterEnabled && features.push('emailParameter');
  json.CancelCampaignEnabled && features.push('cancelCampaign');
  json.SiteTrackingLicensed && features.push('siteTracking');
  json.SmartCampaignsEnabled && features.push('smartCampaigns');
  json.ShippingLimitEnabled && features.push('shippingLimit');

  const billingCycleDetails = json.DiscountXPlan.length
    ? json.DiscountXPlan.filter(
        (discount: any) => paymentTypeByPaymentMethod[discount.IdPaymentMethod] === 'CC',
      ).map(mapAdvancePay)
    : [];
  switch (type) {
    case 'monthly-deliveries':
      return {
        type: 'monthly-deliveries',
        id: id,
        name: `${emailsByMonth}-EMAILS-${featureSet.toUpperCase()}`,
        emailsByMonth: emailsByMonth,
        extraEmailPrice: extraEmailPrice,
        fee: fee,
        featureSet: featureSet,
        features: features,
        billingCycleDetails: billingCycleDetails,
      };
    case 'subscribers':
      return {
        type: 'subscribers',
        id: id,
        name: `${subscriberLimit}-SUBSCRIBERS-${featureSet.toUpperCase()}`,
        subscriberLimit: subscriberLimit,
        fee: fee,
        featureSet: featureSet,
        featureList: features,
        billingCycleDetails: billingCycleDetails,
      };
    case 'prepaid':
      return {
        type: 'prepaid',
        id: id,
        name: `${emailsByMonth}-CREDITS`,
        credits: emailsByMonth,
        price: fee,
        featureSet: 'standard',
      };
  }
}

function mapIdUserToken(jwtToken: string) {
  if (jwtToken) {
    var tokenDecoded = jwt_decode<any>(jwtToken);
    return tokenDecoded.nameid || 0;
  }

  return 0;
}

export function mapHeaderDataJson(json: any) {
  return {
    alert: json.alert && {
      button: json.alert.button && {
        text: json.alert.button.text,
        url: json.alert.button.url,
        action: json.alert.button.action,
      },
      message: json.alert.message,
      type: json.alert.type,
    },
    nav: (json.nav && json.nav.map(mapNavMainEntry)) || [],
    user: {
      idUser: mapIdUserToken(json.jwtToken),
      avatar: json.user.avatar,
      email: json.user.email,
      fullname: json.user.fullname,
      hasClientManager: !!json.user.clientManager,
      clientManager: json.user.clientManager,
      lang: json.user.lang,
      nav: (json.user.nav && json.user.nav.map(mapNavEntry)) || [],
      plan: mapPlanEntry(json.user.plan),
      sms: json.user.sms?.description ? mapSmsEntry(json.user.sms) : {},
    },
    jwtToken: json.jwtToken,
    notifications: json.notifications || [],
    emptyNotificationText: json.emptyNotificationText || '',
    datahubCustomerId: json.datahubCustomerId || null,
    features: {
      siteTrackingEnabled: !!(json.features && json.features.siteTrackingEnabled),
      siteTrackingActive: !!(json.features && json.features.siteTrackingActive),
      emailParameterEnabled: !!(json.features && json.features.emailParameterEnabled),
      emailParameterActive: !!(json.features && json.features.emailParameterActive),
    },
  };
}

/* #endregion */

export class HttpDopplerLegacyClient implements DopplerLegacyClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;
  private window: any;

  private isUrlIncludedInRetryList(currentUrl: any): any {
    const urls = [
      'WebAppPublic/Login',
      'WebAppPublic/CreateUser',
      'WebAppPublic/SendResetPasswordEmail',
    ];
    return urls.includes(currentUrl);
  }

  private isEnabledForRetry(error: AxiosError) {
    return error.config && this.isUrlIncludedInRetryList(error.config.url);
  }

  constructor({
    axiosStatic,
    baseUrl,
    window,
  }: {
    axiosStatic: AxiosStatic;
    baseUrl: string;
    window: any;
  }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: baseUrl,
      withCredentials: true,
    });
    this.window = window;
    const configRetryCount = 3;

    axiosRetry(this.axios, {
      retries: configRetryCount,
      shouldResetTimeout: true,
      retryCondition: (error) => {
        return this.isEnabledForRetry(error);
      },
      retryDelay: (retryCount: any, error: any) => {
        if (retryCount === configRetryCount) {
          logAxiosRetryError(error, addLogEntry);
        }
        return retryCount * 200;
      },
    });
  }

  public async getUserData() {
    const response = await this.axios.get('/WebApp/GetUserData');
    if (!response || !response.data) {
      throw new Error('Empty Doppler response');
    }
    if (response.data.error) {
      throw new Error(`Doppler Error: ${response.data.error}`);
    }

    return mapHeaderDataJson(response.data);
  }

  public async getAllPlans(): Promise<Plan[]> {
    const response = await this.axios.get('/WebApp/GetAllPlans');
    if (!response?.data) {
      throw new Error('Empty Doppler response');
    }

    return sanitizePlans(response.data.data).map(parsePlan);
  }

  public async login(model: LoginModel): Promise<LoginResult> {
    try {
      const response = await this.axios.post(`WebAppPublic/Login`, {
        Username: model.username,
        Password: model.password,
        RecaptchaUserCode: model.captchaResponseToken,
      });

      if (!response.data.success) {
        switch (response.data.error) {
          case 'BlockedAccountNotPayed': {
            return { expectedError: { blockedAccountNotPayed: true } };
          }
          case 'AccountNotValidated': {
            return { expectedError: { accountNotValidated: true } };
          }
          case 'CancelatedAccount': {
            return { expectedError: { cancelatedAccount: true } };
          }
          case 'CancelatedAccountNotPayed': {
            return { expectedError: { cancelatedAccountNotPayed: true } };
          }
          case 'BlockedAccountInvalidPassword': {
            return { expectedError: { blockedAccountInvalidPassword: true } };
          }
          case 'InvalidLogin': {
            return { expectedError: { invalidLogin: true } };
          }
          case 'MaxLoginAttempts': {
            return { expectedError: { maxLoginAttempts: true } };
          }
          case 'BlockedAccountCMDisabled': {
            return {
              expectedError: {
                blockedAccountCMDisabled: true,
                errorMessage: removeErrorCodeFromExceptionMessage(
                  'BlockedAccountCMDisabled - ',
                  response.data.message,
                ),
              },
            };
          }
          case 'WrongCatpcha': {
            return {
              expectedError: { wrongCaptcha: true },
              message: response.data.error || null,
              trace: new Error(),
              fullResponse: response,
            };
          }
          default: {
            return {
              message: response.data.error || null,
              trace: new Error(),
              fullResponse: response,
            };
          }
        }
      }

      if (response.data.returnTo) {
        return {
          success: true,
          value: { redirectUrl: response.data.returnTo },
        };
      }

      return { success: true, value: {} };
    } catch (error) {
      return {
        message: error.message || null,
        error: error.toJSON(),
        response: !error.response ? `No response available` : error.response,
        stackCall: new Error(),
      };
    }
  }

  public async registerUser(model: UserRegistrationModel): Promise<UserRegistrationResult> {
    try {
      const response = await this.axios.post(`WebAppPublic/CreateUser`, {
        FirstName: model.firstname,
        LastName: model.lastname,
        Phone: model.phone,
        Email: model.email,
        Password: model.password,
        TermsAndConditionsActive: !!model.accept_privacy_policies,
        PromotionsEnabled: !!model.accept_promotions,
        ClientTimeZoneOffset: -new Date().getTimezoneOffset(),
        FirstOrigin: model.firstOrigin,
        Origin: model.origin,
        Language: model.language || 'es',
        RecaptchaUserCode: model.captchaResponseToken,
        Redirect: model.redirect,
      });

      if (!response.data.success) {
        switch (response.data.error) {
          case 'EmailAlreadyExists': {
            return { expectedError: { emailAlreadyExists: true } };
          }
          case 'BlockedDomain': {
            return { expectedError: { blockedDomain: true } };
          }
          case 'RegisterDenied': {
            return { expectedError: { registerDenied: true } };
          }
          default: {
            return {
              message: response.data.error || null,
            };
          }
        }
      }

      return { success: true };
    } catch (error) {
      return {
        message: error.message || null,
        error: error,
      };
    }
  }

  public async resendRegistrationEmail(model: ResendRegistrationModel) {
    try {
      await this.axios.post(`WebAppPublic/SendRegistrationEmail`, {
        Email: model.email,
        RecaptchaUserCode: model.captchaResponseToken,
      });
    } catch (e) {
      // TODO: deal with this error in a better way
      console.log('Error resending registration email', e);
    }
  }

  public async getUpgradePlanData(isSubscriberPlan: boolean) {
    const idUserType = isSubscriberPlan ? 4 : 2;
    const response = await this.axios.get(
      `/SendUpgradePlanContactEmail/GetUpgradePlanData?idUserType=${idUserType}`,
    );
    if (!response || !response.data || !response.data.data || !response.data.data.ClientTypePlans) {
      throw new Error('Empty Doppler response');
    }
    if (response.data.error) {
      throw new Error(`Doppler Error: ${response.data.error}`);
    }

    return response.data.data.ClientTypePlans.map((x: any) => ({
      IdUserTypePlan: x.IdUserTypePlan,
      Description: x.Description,
    }));
  }

  public async sendEmailUpgradePlan(planModel: DopplerLegacyUpgradePlanContactModel) {
    // TODO: research why axios cancels this request. In the meantime, we are using fetch.
    await fetch(this.baseUrl + '/SendUpgradePlanContactEmail/SendEmailUpgradePlan', {
      method: 'post',
      body: JSON.stringify(planModel),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include',
    });
    // TODO: handle error responses
  }

  public async activateSiteTrackingTrial(): Promise<ActivateSiteTrackingTrialResult> {
    try {
      const response = await this.axios.post('/WebApp/EnableSiteTrackingTrial');
      if (!response.data.success) {
        return {
          message: response.data.error || null,
        };
      }
      return { success: true };
    } catch (error) {
      return {
        message: error.message || null,
        error: error,
      };
    }
  }

  public async sendResetPasswordEmail(model: ForgotPasswordModel): Promise<ForgotPasswordResult> {
    try {
      const response = await this.axios.post('WebAppPublic/SendResetPasswordEmail', {
        Email: model.email,
        RecaptchaUserCode: model.captchaResponseToken,
      });

      if (!response.data.success) {
        return {
          message: response.data.error || null,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        message: error.message || null,
        error: error,
      };
    }
  }

  public async requestAgenciesDemo(
    model: RequestAgenciesDemoModel,
  ): Promise<RequestAgenciesDemoResult> {
    const response = await this.axios.post('/WebApp/RequestAgenciesDemo', {
      Email: model.email,
      Firstname: model.firstname,
      Lastname: model.lastname,
      Phone: model.phone,
      ContactSchedule: model.range_time,
      SendingVolume: model.volume,
    });

    if (!response.data.success) {
      return {
        message: response.data.error || null,
      };
    }

    return { success: true };
  }

  public async requestExclusiveFeaturesDemo(
    model: RequestExclusiveFeaturesDemoModel,
  ): Promise<RequestExclusiveFeaturesDemoResult> {
    const response = await this.axios.post('/WebApp/RequestExclusiveFeaturesDemo', {
      Email: model.email,
      Firstname: model.firstname,
      Lastname: model.lastname,
      Phone: model.phone,
      ContactSchedule: model.range_time,
      Features: model.features,
    });

    if (!response.data.success) {
      return {
        message: response.data.error || null,
      };
    }

    return { success: true };
  }

  public async isDopplerMVCUp(): Promise<boolean> {
    const response = await this.axios.get('/WebAppPublic/DopplerMVCUp');
    if (!response || !response.data) {
      throw new Error('Empty Doppler response');
    }
    return response.data;
  }

  // TODO: replace this when implement BE connection
  public async getPlansList(idPlan: number) {
    console.log('getPlansLists', idPlan);
    return {
      planList: [
        { idPlan: 1, price: 15, amount: 1500 },
        { idPlan: 2, price: 29, amount: 2500 },
        { idPlan: 3, price: 48, amount: 5000 },
        { idPlan: 4, price: 77, amount: 10000 },
        { idPlan: 5, price: 106, amount: 15000 },
        { idPlan: 6, price: 145, amount: 25000 },
        { idPlan: 7, price: 240, amount: 50000 },
        { idPlan: 9, price: 340, amount: 75000 },
        { idPlan: 10, price: 460, amount: 100000 },
      ],
      discounts: [
        { id: 1, percent: 0, monthsAmmount: 1, description: 'Mensual' },
        { id: 2, percent: 5, monthsAmmount: 3, description: 'Trimestral' },
        { id: 3, percent: 15, monthsAmmount: 6, description: 'Semestral' },
        { id: 4, percent: 25, monthsAmmount: 12, description: 'Anual' },
      ],
      success: true,
    };
    // return { success: false };
  }
}
