import { AxiosInstance, AxiosStatic } from 'axios';
import { Color } from 'csstype';
import headerDataJson from '../headerData.json';

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
}

export interface DopplerLegacyClient {
  getUserData(): Promise<DopplerLegacyUserData>;
}

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
      },
      message: json.alert.type,
      type: json.alert.type,
    },
    nav: (json.nav && json.nav.map(mapNavMainEntry)) || [],
    user: {
      avatar: json.user.avatar,
      email: json.email,
      fullname: json.user.fullname,
      hasClientManager: !!json.clientManager,
      lang: json.user.lang,
      nav: (json.user.nav && json.user.nav.map(mapNavEntry)) || [],
      plan: mapPlanEntry(json.user.plan),
    },
  };
}

export class HttpDopplerLegacyClient implements DopplerLegacyClient {
  private readonly axios: AxiosInstance;

  constructor(axiosStatic: AxiosStatic, baseUrl: string) {
    this.axios = axiosStatic.create({
      baseURL: baseUrl,
      withCredentials: true,
    });
  }

  public async getUserData() {
    var response = await this.axios.get('/Reports/Reports/GetUserData');
    if (!response || !response.data || response.data.Email) {
      throw new Error('Empty Doppler response');
    }

    // TODO: get this data from backend
    const { alert, nav, user } = mapHeaderDataJson(headerDataJson);

    return {
      alert: alert,
      nav: nav,
      user: {
        ...user,
        email: response.data.email,
      },
    };
  }
}
