import {
  DopplerLegacyClient,
  mapHeaderDataJson,
  DopplerLegacyUpgradePlanContactModel,
  UserRegistrationModel,
  UserRegistrationResult,
  LoginModel,
  LoginResult,
  ResendRegistrationModel,
} from './doppler-legacy-client';
import headerDataJson from '../headerData.json';
import { timeout } from '../utils';

export class HardcodedDopplerLegacyClient implements DopplerLegacyClient {
  public constructor(public readonly email = 'hardcoded@email.com') {}

  public async login(model: LoginModel): Promise<LoginResult> {
    console.log(this.login, model);
    await timeout(1500);
    return { success: true };
    // return { expectedError: { blockedAccountNotPayed: true } };
    // return { expectedError: { accountNotValidated: true } };
  }

  public async registerUser(model: UserRegistrationModel): Promise<UserRegistrationResult> {
    console.log(this.registerUser, model);
    await timeout(1500);
    return { success: true };
  }

  public async resendRegistrationEmail(model: ResendRegistrationModel) {
    console.log(this.resendRegistrationEmail, model);
    await timeout(1500);
  }

  public async getUserData() {
    console.log('getUserData');
    await timeout(1500);
    const { user, nav, alert, datahubCustomerId, jwtToken } = mapHeaderDataJson(headerDataJson);

    return {
      user: {
        ...user,
        email: this.email,
      },
      nav: nav,
      alert,
      datahubCustomerId,
      jwtToken,
    };
  }

  public async getUpgradePlanData(isSubscriberPlan: boolean) {
    console.log('getUpgradePlanData', { isSubscriberPlan });
    await timeout(3000);
    return [
      {
        IdUserTypePlan: 1,
        Description: 'Plan 1 Descripción',
        EmailQty: 12345,
        Fee: 678.9,
        ExtraEmailCost: 0.0123,
        SubscribersQty: 456,
      },
      {
        IdUserTypePlan: 2,
        Description: 'Plan 2 Descripción',
        EmailQty: null,
        Fee: 678.9,
        ExtraEmailCost: null,
        SubscribersQty: 456,
      },
      {
        IdUserTypePlan: 3,
        Description: 'Plan 3 Descripción',
        EmailQty: 12345,
        Fee: 678.9,
        ExtraEmailCost: 0.0123,
        SubscribersQty: null,
      },
    ];
  }

  public async sendEmailUpgradePlan(planModel: DopplerLegacyUpgradePlanContactModel) {
    console.log('sendEmailUpgradePlan', { planModel });
    await timeout(1500);
  }

  public async activateSiteTrackingTrial() {
    console.log('activateSiteTrackingTrial');
    await timeout(1500);
  }
}
