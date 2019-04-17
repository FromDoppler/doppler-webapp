import { AxiosInstance, AxiosStatic } from 'axios';
import { Color } from 'csstype';

export interface DopplerLegacyClient {
  getUserData(): Promise<DopplerLegacyUserData>;
  getUpgradePlanData(isSubscriberPlan: boolean): Promise<DopplerLegacyClientTypePlan[]>;
  sendEmailUpgradePlan(planModel: DopplerLegacyUpgradePlanContactModel): Promise<void>;
  registerUser(userRegistrationModel: UserRegistrationModel): Promise<UserRegistrationResult>;
  resendRegistrationEmail(email: string): Promise<void>;
}

export type UserRegistrationResult =
  | { success: true }
  | { success: false; unexpectedError?: false; emailAlreadyExists: true; blockedDomain?: false }
  | { success: false; unexpectedError?: false; emailAlreadyExists?: false; blockedDomain: true }
  | { success: false; unexpectedError: true; message: string | null; error?: any };

/* #region Registration data types */
export interface UserRegistrationModel {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  accept_privacy_policies: boolean;
  accept_promotions: boolean;
  /*
  // TODO: take into account the following data
    ClientTimeZoneOffset=-180
    FingerPrint=317203850
    origin=login
    Language=en
    showCaptcha=False
    IdCountry=10
*/
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

export interface DopplerLegacyUserData {
  alert: AlertEntry | undefined;
  nav: MainNavEntry[];
  user: UserEntry;
  jwtToken: string;
  datahubCustomerId: string | null;
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
  };
}

function mapNavEntry(json: any): NavEntry {
  return {
    isSelected: json.isSelected,
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

  public async registerUser(model: UserRegistrationModel): Promise<UserRegistrationResult> {
    try {
      const response = await this.axios.post(`WebAppPublic/CreateUser`, {
        FirstName: model.firstname,
        LastName: model.lastname,
        Phone: model.phone,
        Email: model.email,
        Password: model.password,
        TermsAndConditionsActive: model.accept_privacy_policies,
        PromotionsEnabled: model.accept_promotions,
        ClientTimeZoneOffset: model.clientTimeZoneOffset || 0,
        Origin: model.origin || 'login',
      });

      if (!response.data.success && response.data.error == 'EmailAlreadyExists') {
        return { success: false, unexpectedError: false, emailAlreadyExists: true };
      }

      if (!response.data.success && response.data.error == 'BlockedDomain') {
        return { success: false, unexpectedError: false, blockedDomain: true };
      }

      if (!response.data.success) {
        return {
          success: false,
          unexpectedError: true,
          message: response.data.error || null,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        unexpectedError: true,
        message: error.message || null,
        error: error,
      };
    }
  }

  public async resendRegistrationEmail(email: string) {
    await this.axios.post(`WebAppPublic/ResendRegistrationEmail`, { Email: email });
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
}
