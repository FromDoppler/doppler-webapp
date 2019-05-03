import { AxiosInstance, AxiosStatic } from 'axios';
import { Color } from 'csstype';

export interface DopplerLegacyClient {
  getUserData(): Promise<DopplerLegacyUserData>;
  getUpgradePlanData(isSubscriberPlan: boolean): Promise<DopplerLegacyClientTypePlan[]>;
  login(loginModel: LoginModel): Promise<LoginResult>;
  sendEmailUpgradePlan(planModel: DopplerLegacyUpgradePlanContactModel): Promise<void>;
  registerUser(userRegistrationModel: UserRegistrationModel): Promise<UserRegistrationResult>;
  resendRegistrationEmail(resendRegistrationModel: ResendRegistrationModel): Promise<void>;
  activateSiteTrackingTrial(): Promise<void>;
}

// TODO: move it a common place if it will be reused
type UnexpectedError = { success?: false; message?: string | null; error?: any };
type ErrorResult<TError> = { success?: false; expectedError: TError } | UnexpectedError;
type Result<TResult, TError> = { success: true; value: TResult } | ErrorResult<TError>;
type EmptyResult<TError> = { success: true } | ErrorResult<TError>;

interface PayloadWithCaptchaToken {
  captchaResponseToken: string;
}

/* #region Login data types */

export type LoginErrorResult =
  | { blockedAccountNotPayed: true; accountNotValidated?: false; cancelatedAccount?: false }
  | { accountNotValidated: true; cancelatedAccount?: false; blockedAccountNotPayed?: false }
  | { cancelatedAccount: true; blockedAccountNotPayed?: false; accountNotValidated?: false };

export type LoginResult = EmptyResult<LoginErrorResult>;

export interface LoginModel extends PayloadWithCaptchaToken {
  username: string;
  password: string;
}

/* #endregion */

/* #region Registration data types */

type UserRegistrationErrorResult =
  | { emailAlreadyExists: true; blockedDomain?: false }
  | { emailAlreadyExists?: false; blockedDomain: true };

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
}

interface AvatarEntry {
  color: Color;
  text: string;
}

interface UserEntry {
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
  datahubCustomerId: string | null;
  features: DopplerFeatures;
}
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
    isFreeAccount: json.planType == 1 || json.planType == 7,
  };
}
//TODO: Refactor backend to send proper active values
function mapNavEntry(json: any): NavEntry {
  return {
    isSelected: ['Reports', 'Advanced', 'Reportes', 'Avanzados'].includes(json.title),
    title: json.title,
    url: json.url,
  };
}

function mapNavMainEntry(json: any): MainNavEntry {
  return {
    ...mapNavEntry(json),
    subNav: (json.subNav && json.subNav.map(mapNavEntry)) || [],
  };
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
      avatar: json.user.avatar,
      email: json.user.email,
      fullname: json.user.fullname,
      hasClientManager: !!json.clientManager,
      lang: json.user.lang,
      nav: (json.user.nav && json.user.nav.map(mapNavEntry)) || [],
      plan: mapPlanEntry(json.user.plan),
    },
    jwtToken: json.jwtToken,
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

/* #region Upgrade Plan data types */
export interface DopplerLegacyClientTypePlan {
  IdUserTypePlan: number;
  Description: string;
}

export interface DopplerLegacyUpgradePlanContactModel {
  Detail: string;
  IdClientTypePlanSelected: number;
}
/* #endregion */

export class HttpDopplerLegacyClient implements DopplerLegacyClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;

  constructor({ axiosStatic, baseUrl }: { axiosStatic: AxiosStatic; baseUrl: string }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: baseUrl,
      withCredentials: true,
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

  public async login(model: LoginModel): Promise<LoginResult> {
    try {
      const response = await this.axios.post(`WebAppPublic/Login`, {
        Username: model.username,
        Password: model.password,
        RecaptchaUserCode: model.captchaResponseToken,
      });

      if (!response.data.success && response.data.error == 'BlockedAccountNotPayed') {
        return { expectedError: { blockedAccountNotPayed: true } };
      }

      if (!response.data.success && response.data.error == 'AccountNotValidated') {
        return { expectedError: { accountNotValidated: true } };
      }

      if (!response.data.success && response.data.error == 'CancelatedAccount') {
        return { expectedError: { cancelatedAccount: true } };
      }

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
      });

      if (!response.data.success && response.data.error == 'EmailAlreadyExists') {
        return { expectedError: { emailAlreadyExists: true } };
      }

      if (!response.data.success && response.data.error == 'BlockedDomain') {
        return { expectedError: { blockedDomain: true } };
      }

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

  public async activateSiteTrackingTrial() {
    const response = await this.axios.get('/WebApp/ActivateSiteTrackingTrial');
    if (!response || !response.data) {
      throw new Error('Empty Doppler response');
    }
    if (!response.data.success) {
      throw new Error(`Doppler Error: ${response.data.error}`);
    }
  }
}
