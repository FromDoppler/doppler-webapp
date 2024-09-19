import { AxiosInstance, AxiosStatic, AxiosError } from 'axios';
import { Property } from 'csstype';
import { Result, EmptyResultWithoutExpectedErrors } from '../doppler-types';
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
  getLandingPagesAmount(idUser: number): Promise<any>;
  requestAgenciesDemo(
    requestAgenciesDemoModel: RequestAgenciesDemoModel,
  ): Promise<RequestAgenciesDemoResult>;
  isDopplerMVCUp(): Promise<boolean>;
  requestExclusiveFeaturesDemo(
    requestExclusiveFeaturesDemoModel: RequestExclusiveFeaturesDemoModel,
  ): Promise<RequestExclusiveFeaturesDemoResult>;
  requestSuggestionUpgradeForm(
    requestUpgradeModel: RequestUpgradeModel,
  ): Promise<ReturnUpgradeFormResult>;
  getMaxSubscribersData(): Promise<MaxSubscribersData>;
  sendMaxSubscribersData(maxSubscribersData: MaxSubscribersData): Promise<boolean>;
  sendAcceptButtonAction(): Promise<boolean>;
  confirmCollaborationinvite(
    token: string,
    model: RequestCollaborationInviteModel | undefined,
  ): Promise<ReturnConfirmCollaborationInvite>;
  activateConversationPlan(): Promise<boolean>;
  verifyUserAccountExistens(email: string): Promise<any>;
  getUserAccountData(model: LoginModel): Promise<UserAccountLoginResult>;
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
  volume: string;
  message: string;
}

export interface RequestUpgradeModel {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  range_time: string;
  message: string;
}

export interface RequestCollaborationInviteModel {
  firstname: string;
  lastname: string;
  phone: string;
  password: string;
  accept_privacy_policies: boolean;
  accept_promotions: string;
  language: string;
}

export type ForgotPasswordResult = EmptyResultWithoutExpectedErrors;

export type RequestAgenciesDemoResult = EmptyResultWithoutExpectedErrors;

export type RequestExclusiveFeaturesDemoResult = EmptyResultWithoutExpectedErrors;

export type ActivateSiteTrackingTrialResult = EmptyResultWithoutExpectedErrors;

export type ReturnUpgradeFormResult = EmptyResultWithoutExpectedErrors;

export type ReturnConfirmCollaborationInvite = {
  success: boolean;
  message: string;
};

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
      accountWithoutUsersAssociated?: false;
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
      accountWithoutUsersAssociated?: false;
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
      accountWithoutUsersAssociated?: false;
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
      accountWithoutUsersAssociated?: false;
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
      accountWithoutUsersAssociated?: false;
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
      accountWithoutUsersAssociated?: false;
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
      accountWithoutUsersAssociated?: false;
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
      accountWithoutUsersAssociated?: false;
      errorMessage: string;
    }
  | {
      blockedAccountInvalidPassword?: false;
      blockedAccountNotPayed?: false;
      accountNotValidated?: false;
      cancelatedAccount?: false;
      invalidLogin?: false;
      maxLoginAttempts?: false;
      wrongCaptcha?: false;
      blockedAccountCMDisabled: false;
      accountWithoutUsersAssociated: true;
      errorMessage?: string;
    };

export type LoginResult = Result<
  { redirectUrl?: string; provisoryToken?: string },
  LoginErrorResult
>;

export type UserAccountLoginResult = Result<UserAccountEntry, LoginErrorResult>;

export interface LoginModel extends PayloadWithCaptchaToken {
  username: string;
  password: string;
  fingerPrint: number | string;
  fingerPrintV2: number | string;
}

function removeErrorCodeFromExceptionMessage(errorCode: string, message: string) {
  return message.search(errorCode) !== -1 ? message.substring(errorCode.length) : message;
}

/* #endregion */

/* #region Registration data types */

type UserRegistrationErrorResult =
  | {
      emailAlreadyExists: true;
      blockedDomain?: false;
      registerDenied?: false;
      invalidDomain?: false;
      confirmationSendFail?: false;
    }
  | {
      emailAlreadyExists?: false;
      blockedDomain: true;
      registerDenied?: false;
      invalidDomain?: false;
      confirmationSendFail?: false;
    }
  | {
      emailAlreadyExists?: false;
      blockedDomain?: false;
      registerDenied: true;
      invalidDomain?: false;
      confirmationSendFail?: false;
    }
  | {
      emailAlreadyExists?: false;
      blockedDomain?: false;
      registerDenied?: false;
      invalidDomain: true;
      confirmationSendFail?: false;
    }
  | {
      emailAlreadyExists?: false;
      blockedDomain?: false;
      registerDenied?: false;
      invalidDomain?: false;
      confirmationSendFail?: true;
    };

export type UserRegistrationResult = Result<
  { verificationCode?: string },
  UserRegistrationErrorResult
>;

interface UTMCookie {
  date: string;
  UTMSource: string;
  UTMCampaign: string;
  UTMMedium: string;
  UTMTerm: string;
  gclid: string;
  UTMContent: string;
  Origin_Inbound: string;
}

export interface UserRegistrationModel extends PayloadWithCaptchaToken {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  accept_privacy_policies: boolean;
  accept_promotions: boolean;
  origin: string;
  page: string;
  language: string;
  redirect?: string;
  utm_source: string;
  utm_term: string;
  utm_medium: string;
  utm_campaign: string;
  utm_cookies: UTMCookie[];
  gclid: string;
  utm_content: string;
  origin_inbound: string;
  fingerprint: number | string;
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
  planDiscount: number;
  planSubscription: number;
  subscribersCount: number;
  planFee: number;
  trialExpired: boolean;
  upgradePending: boolean;
}

interface ChatPlanEntry {
  planId: number;
  description: string;
  conversationsQty: number;
  fee: number;
  additionalConversation: number;
  additionalAgent: number;
  additionalChannel: number;
  agents: number;
  channels: number;
  active: boolean;
}

interface SmsEntry {
  buttonText: string;
  buttonUrl: string;
  description: string;
  remainingCredits: number;
  smsEnabled: boolean;
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

interface UserAccountEntry {
  email: string;
  firstName: string;
  lastName: string;
  userProfileType: string;
  phone: string;
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
  inviteCollaboratorsEnabled: boolean;
}

export interface DopplerLegacyUserData {
  alert: AlertEntry | undefined;
  nav: MainNavEntry[];
  user: UserEntry;
  userAccount: UserAccountEntry | undefined;
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

export interface SurveyFormStatus {
  surveyFormCompleted: Boolean;
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
    planDiscount: json.planDiscount,
    planSubscription: json.monthPlan ? json.monthPlan : 1,
    subscribersCount: json.subscribersCount,
    planFee: json.planFee,
    trialExpired: json.trialExpired,
    upgradePending: json.upgradePending,
  };
}
function mapSmsEntry(json: any): SmsEntry {
  return {
    buttonText: json.buttonText,
    buttonUrl: json.buttonUrl,
    description: json.description,
    remainingCredits: (json.remainingCredits && JSON.parse(json.remainingCredits)) || 0,
    smsEnabled: json.smsEnabled,
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
    applyPromo: json.ApplyPromo,
  };
}

function mapChatPlanEntry(json: any): ChatPlanEntry {
  return {
    planId: json ? json.idPlan : 0,
    description: json ? json.description : '',
    conversationsQty: json ? json.conversationQty : 0,
    fee: json ? json.fee : 0,
    additionalConversation: json ? json.additionalConversation : 0,
    additionalAgent: json ? json.additionalAgent : 0,
    additionalChannel: json ? json.additionalChannel : 0,
    agents: json ? json.agents : 0,
    channels: json ? json.canales : 0,
    active: json ? json.active : false,
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
  // TODO: the features are available for all users.
  // Analyze the treatment to clean the code related with them.
  features.push('shippingLimit');

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
        extraEmailPrice: extraEmailPrice,
        price: fee,
        featureSet: 'standard',
      };
  }
}

function mapIdUserToken(jwtToken: string) {
  try {
    if (jwtToken) {
      var tokenDecoded = jwt_decode<any>(jwtToken);
      return tokenDecoded.nameid || 0;
    }
  } catch (error) {
    console.error(error);
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
      nextAlert: json.alert.nextAlert,
    },
    nav: (json.nav && json.nav.map(mapNavMainEntry)) || [],
    user: {
      idUser: mapIdUserToken(json.jwtToken), // TODO: read from content
      avatar: json.user.avatar,
      email: json.user.email,
      isLastPlanRequested: json.user.isLastPlanRequested,
      fullname: json.user.fullname,
      hasClientManager: !!json.user.clientManager,
      clientManager: json.user.clientManager,
      lang: json.user.lang,
      nav: (json.user.nav && json.user.nav.map(mapNavEntry)) || [],
      plan: mapPlanEntry(json.user.plan),
      sms: json.user.sms?.description ? mapSmsEntry(json.user.sms) : {},
      hasCampaingSent: json.user.hasCampaingSent,
      locationCountry: json.user.locationCountry,
      landings: json.user.landings,
      chat: {
        active:
          process.env.REACT_APP_DOPPLER_CAN_BUY_CHAT_PLAN === 'true' && json.user.chat?.active,
        plan: mapChatPlanEntry(json.user.chat?.planData),
      },
    },
    userAccount: json.userAccount && {
      email: json.userAccount.email,
      firstName: json.userAccount.firstName,
      lastName: json.userAccount.lastName,
      userProfileType: json.userAccount.userProfileType,
      phone: json.userAccount.phone,
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
      landingsEditorEnabled: !!(json.features && json.features.landingsEditorEnabled),
      inviteCollaboratorsEnabled: !!(json.features && json.features.inviteCollaboratorsEnabled),
    },
  };
}

function handleExpectedErrorMessageOnLogin(errorResponse: any) {
  switch (errorResponse.data.error) {
    case 'BlockedAccountNotPayed': {
      return {
        expectedError: { blockedAccountNotPayed: true },
        provisoryToken: errorResponse.data.provisoryToken,
      };
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
    case 'BlockedUserUnknownDevice': {
      return { expectedError: { blockedUserUnknownDevice: true } };
    }
    case 'BlockedUserPendingConfirmation': {
      return { expectedError: { blockedUserPendingConfirmation: true } };
    }
    case 'UserAccessDenied': {
      return { expectedError: { userAccessDenied: true } };
    }
    case 'InvalidLogin': {
      return { expectedError: { invalidLogin: true } };
    }
    case 'MaxLoginAttempts': {
      return { expectedError: { maxLoginAttempts: true } };
    }
    case 'AccountWithoutUsersAssociated': {
      return { expectedError: { accountWithoutUsersAssociated: true } };
    }
    case 'BlockedAccountCMDisabled': {
      return {
        expectedError: {
          blockedAccountCMDisabled: true,
          errorMessage: removeErrorCodeFromExceptionMessage(
            'BlockedAccountCMDisabled - ',
            errorResponse.data.message,
          ),
        },
      };
    }
    case 'WrongCatpcha': {
      return {
        expectedError: { wrongCaptcha: true },
        message: errorResponse.data.error || null,
        trace: new Error(),
        fullResponse: errorResponse,
      };
    }
    default: {
      return {
        message: errorResponse.data.error || null,
        trace: new Error(),
        fullResponse: errorResponse,
      };
    }
  }
}
/* #endregion */

/* #region Maxsubscribers data */
export interface MaxSubscribersData {
  isSentSuccessEmail: boolean;
  questionsList: MaxSubscribersQuestion[];
  urlHelp: string;
  urlReferrer: string;
}

export interface MaxSubscribersQuestion {
  question: string;
  answer: SubscriberValidationAnswer;
}

export interface SubscriberValidationAnswer {
  answerType: string;
  answerOptions: string[];
  value: string;
  optionsSelected: string[];
}

export enum AnswerType {
  TEXTFIELD = 1,
  CHECKBOX = 2,
  CHECKBOX_WITH_TEXTAREA = 3,
  DROPDOWN = 4,
  RADIOBUTTON = 5,
  URL = 6,
}

function mapMaxSubscribersQuestion(json: any): MaxSubscribersQuestion {
  return {
    question: json.Question,
    answer: {
      answerType: AnswerType[json.Answer?.AnswerType],
      answerOptions: json.Answer?.AnswerOptions,
      optionsSelected: json.Answer?.OptionsSelected ?? [],
      value: json.Answer?.Value ?? '',
    },
  };
}

function mapMaxSubscribersData(json: any): MaxSubscribersData {
  return {
    isSentSuccessEmail: json.data?.IsSentSuccessEmail,
    questionsList: json.data?.QuestionsList.map((question: any) =>
      mapMaxSubscribersQuestion(question),
    ),
    urlHelp: json.data?.UrlHelp,
    urlReferrer: json.data?.UrlReferrer,
  };
}

function mapMaxSubscribersQuestionData(question: MaxSubscribersQuestion): any {
  return {
    Question: question.question,
    Answer: {
      AnswerType: AnswerType[question.answer?.answerType as any],
      AnswerOptions: question.answer?.answerOptions,
      OptionsSelected: question.answer?.optionsSelected.length === 0 ? null : [],
      Value: question.answer?.value,
    },
  };
}

function mapMaxSubscribersDataToJson(maxSubscribersData: MaxSubscribersData): any {
  return {
    IsSentSuccessEmail: maxSubscribersData.isSentSuccessEmail,
    QuestionsList: maxSubscribersData.questionsList.map((question: any) =>
      mapMaxSubscribersQuestionData(question),
    ),
    UrlHelp: maxSubscribersData.urlHelp,
    UrlReferrer: maxSubscribersData.urlReferrer,
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

    if (!!this.axios) {
      // TODO: fix this for AppCompositionRootTest in a better way: this allows to continue when axios is undefined
      axiosRetry(this.axios, {
        retries: configRetryCount,
        shouldResetTimeout: true,
        retryCondition: (error) => {
          return this.isEnabledForRetry(error);
        },
        retryDelay: (retryCount: any, error: any) => {
          if (retryCount === configRetryCount) {
            logAxiosRetryError(error, addLogEntry, window);
          }
          return retryCount * 700;
        },
      });
    }
  }

  public async getUserData() {
    const response = await this.axios.get('/WebApp/GetUserData', { timeout: 30000 });
    if (!response || !response.data) {
      throw new Error('Empty Doppler response');
    }
    if (response.data.error) {
      throw new Error(`Doppler Error: ${response.data.error}`);
    }

    return mapHeaderDataJson(response.data);
  }

  public async getLandingPagesAmount(idUser: number) {
    const response = await this.axios.get(`/WebApp/GetLandingPagesAmount?idUser=${idUser}`, {
      timeout: 30000,
    });
    if (!response || !response.data) {
      throw new Error('Empty Doppler response');
    }
    if (response.data.error) {
      throw new Error(`Doppler Error: ${response.data.error}`);
    }

    return response.data.data;
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
        Fingerprint: model.fingerPrint,
        FingerprintV2: model.fingerPrintV2,
      });

      if (!response.data.success) {
        return handleExpectedErrorMessageOnLogin(response);
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
        Origin: model.origin,
        page: model.page,
        Language: model.language || 'es',
        RecaptchaUserCode: model.captchaResponseToken,
        Redirect: model.redirect,
        UTMSource: model.utm_source,
        UTMMedium: model.utm_medium,
        UTMCampaign: model.utm_campaign,
        UTMTerm: model.utm_term,
        UTMCookies: model.utm_cookies,
        gclid: model.gclid,
        UTMContent: model.utm_content,
        Origin_Inbound: model.origin_inbound,
        Fingerprint: model.fingerprint,
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
          case 'General_DomainEmailIsInvalidToCreateAccount': {
            return { expectedError: { confirmationSendFail: true } };
          }
          case 'InvalidDomain': {
            return { expectedError: { invalidDomain: true } };
          }
          default: {
            return {
              message: response.data.error || null,
            };
          }
        }
      }

      if (response.data.verificationCode) {
        return {
          success: true,
          value: { verificationCode: response.data.verificationCode },
        };
      }
      return { success: true, value: {} };
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
      SubscribersQty: x.SubscribersQty,
      EmailQty: x.EmailQty,
    }));
  }

  public async getSurveyFormStatus() {
    try {
      const response = await this.axios.get(`/Integration/Integration/GetSurveyFormStatus`);

      return {
        success: true,
        value: response.data,
      };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  }

  public async setSurveyToCompleted() {
    try {
      await this.axios.post(`/Integration/Integration/SetCompletedForm`);

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
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

  public async upgradePlan(planModel: DopplerLegacyUpgradePlanContactModel) {
    // TODO: research why axios cancels this request. In the meantime, we are using fetch.
    await fetch(this.baseUrl + '/SendUpgradePlanContactEmail/UpgradePlan', {
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
      SendingVolume: model.volume,
      Message: model.message,
    });

    if (!response.data.success) {
      return {
        message: response.data.error || null,
      };
    }

    return { success: true };
  }

  public async requestSuggestionUpgradeForm(
    model: RequestUpgradeModel,
  ): Promise<ReturnUpgradeFormResult> {
    const response = await this.axios.post('/WebApp/RequestSuggestionUpgradeForm', {
      Email: model.email,
      Firstname: model.firstname,
      Lastname: model.lastname,
      Phone: model.phone,
      ContactSchedule: model.range_time,
      Message: model.message,
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
  public async getMaxSubscribersData(): Promise<MaxSubscribersData> {
    const response = await this.axios.get('/sendmaxsubscribersemail/getmaxsubscribersdata');
    return mapMaxSubscribersData(response.data);
  }

  public async sendMaxSubscribersData(maxSubscribersData: MaxSubscribersData): Promise<boolean> {
    const response = await this.axios.post(
      '/sendmaxsubscribersemail/sendemailpopup',
      mapMaxSubscribersDataToJson(maxSubscribersData),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    return response.data;
  }

  public async sendAcceptButtonAction(): Promise<boolean> {
    const response = await this.axios.post('accountpreferences/acceptbuttonaction');
    return response.data;
  }

  public async confirmCollaborationinvite(
    token: string,
    model: RequestCollaborationInviteModel | undefined,
  ): Promise<ReturnConfirmCollaborationInvite> {
    let response;
    const url = '/WebAppPublic/InviteConfirmation?t=' + token;
    if (model) {
      response = await this.axios.post(url, {
        Firstname: model.firstname,
        Lastname: model.lastname,
        Phone: model.phone,
        Password: model.password,
        PrivacypolicyAccepted: model.accept_privacy_policies,
        PromotionAccepted: model.accept_promotions,
        Language: model.language,
      });
    } else {
      response = await this.axios.post(url, {});
    }

    return { success: response.data.success, message: response.data.message };
  }

  public async activateConversationPlan(): Promise<boolean> {
    const response = await this.axios.post('WebApp/EnableConversationsFeature');
    return response.data.success;
  }

  public async verifyUserAccountExistens(email: string): Promise<any> {
    const response = await this.axios.get(
      `/WebAppPublic/IsEmailAssociatedToUserAccount?email=${encodeURIComponent(email)}`,
    );
    return response.data;
  }

  public async getUserAccountData(model: LoginModel): Promise<UserAccountLoginResult> {
    try {
      const response = await this.axios.post(`WebAppPublic/UserAccountLogin`, {
        Username: model.username,
        Password: model.password,
        RecaptchaUserCode: model.captchaResponseToken,
        Fingerprint: model.fingerPrint,
        FingerprintV2: model.fingerPrintV2,
      });

      if (!response.data.success) {
        return handleExpectedErrorMessageOnLogin(response);
      }

      return {
        success: true,
        value: {
          email: response.data.userAccount.Email,
          firstName: response.data.userAccount.FirstName ?? '',
          lastName: response.data.userAccount.LastName ?? '',
          phone: response.data.userAccount.Phone ?? '',
          userProfileType: '',
        },
      };
    } catch (error) {
      return {
        message: error.message || null,
        error: error.toJSON(),
        response: !error.response ? `No response available` : error.response,
        stackCall: new Error(),
      };
    }
  }
}
