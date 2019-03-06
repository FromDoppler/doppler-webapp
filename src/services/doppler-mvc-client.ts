import { AxiosInstance, AxiosStatic } from 'axios';
import { Color } from 'csstype';
import headerDataJson from '../headerData.json';

// TODO: Consider better the name, DopplerMvc tries to make reference to Doppler API implemented
// inside MVC App

interface NavEntry {
  title: string;
  url: string;
  isEnabled: boolean;
  isSelected: boolean;
  // TODO: consider if these fields are necessary:
  // idHTML: string,
  // $$hashKey: string,
}

interface SubNavEntry extends NavEntry {}

interface MainNavEntry extends NavEntry {
  subNav: SubNavEntry[];
}

interface PlanEntry {
  // TODO: consider if this field is necessary:
  // planType: string,
  description: string;
  isSubscribers: boolean; // require conversion from string
  maxSubscribers: number; // require conversion from string
  remainingCredits: number; // require conversion from string
  buttonText: string;
  buttonUrl: string;
}

interface AvatarEntry {
  text: string;
  color: Color;
}

interface UserEntry {
  email: string;
  fullname: string;
  lang: string;
  avatar: AvatarEntry;
  plan: PlanEntry;
  nav: NavEntry[];
}

export interface DopplerMvcUserData {
  user: UserEntry;
  nav: MainNavEntry[];
}

export interface DopplerMvcClient {
  getUserData(): Promise<DopplerMvcUserData>;
}

function mapPlanEntry(json: any): PlanEntry {
  return {
    description: json.description,
    isSubscribers: JSON.parse(json.isSubscribers),
    maxSubscribers: JSON.parse(json.maxSubscribers),
    remainingCredits: JSON.parse(json.remainingCredits),
    buttonText: json.buttonText,
    buttonUrl: json.buttonUrl,
  };
}

function mapNavEntry(json: any): NavEntry {
  return {
    title: json.title,
    url: json.url,
    isEnabled: json.isEnabled,
    isSelected: json.isSelected,
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
    user: {
      fullname: json.user.fullname,
      lang: json.user.lang,
      avatar: json.user.avatar,
      plan: mapPlanEntry(json.user.plan),
      nav: (json.user.nav && json.user.nav.map(mapNavEntry)) || [],
    },
    nav: (json.nav && json.nav.map(mapNavMainEntry)) || [],
  };
}

export class HttpDopplerMvcClient implements DopplerMvcClient {
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

    const { user, nav } = mapHeaderDataJson(headerDataJson);

    return {
      user: {
        ...user,
        email: response.data.email,
      },
      nav: nav,
    };
  }
}
