import {
  DopplerLegacyClient,
  mapHeaderDataJson,
  DopplerLegacyUpgradePlanContactModel,
  UserRegistrationModel,
  UserRegistrationResult,
  LoginModel,
  LoginResult,
  ResendRegistrationModel,
  ForgotPasswordModel,
  ForgotPasswordResult,
  ActivateSiteTrackingTrialResult,
} from './doppler-legacy-client';
import headerDataJson from '../headerData.json';
import { timeout } from '../utils';

export class HardcodedDopplerLegacyClient implements DopplerLegacyClient {
  public constructor(public readonly email = 'hardcoded@email.com') {}

  public async login(model: LoginModel): Promise<LoginResult> {
    console.log(this.login, model);
    await timeout(1500);
    return { success: true, value: {} };
    // return { success: true, value: { redirectUrl: 'Integration/Integration/TiendaNubeIntegration' } };
    // return { expectedError: { blockedAccountNotPayed: true } };
    // return { expectedError: { accountNotValidated: true } };
    // return { expectedError: { cancelatedAccount: true } };
    // return { expectedError: { invalidLogin: true } };
    // return { expectedError: { blockedAccountInvalidPassword: true } };
    // return { expectedError: { maxLoginAttempts: true } };
    // return { success: false, error: 'Error code' };
    // return {
    //   success: false,
    //   message: 'Error code',
    //   trace: new Error(),
    //   fullResponse: { test: 'test' },
    // };
    // return {
    //   expectedError: { wrongCaptcha: true },
    //   message: 'response.data.error' || null,
    //   trace: new Error(),
    //   fullResponse: 'full header response',
    // };
  }

  public async registerUser(model: UserRegistrationModel): Promise<UserRegistrationResult> {
    console.log(this.registerUser, model);
    await timeout(1500);
    return { success: true };
    //return { expectedError: { registerDenied: true } };
  }

  public async resendRegistrationEmail(model: ResendRegistrationModel) {
    console.log(this.resendRegistrationEmail, model);
    await timeout(1500);
  }

  public async getUserData() {
    console.log('getUserData');
    await timeout(1500);
    const {
      user,
      nav,
      alert,
      datahubCustomerId,
      features,
      jwtToken,
      notifications,
      emptyNotificationText,
    } = mapHeaderDataJson(headerDataJson);

    return {
      user: {
        ...user,
        email: this.email,
      },
      nav: nav,
      alert,
      datahubCustomerId,
      features,
      jwtToken,
      notifications,
      emptyNotificationText,
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

  public async activateSiteTrackingTrial(): Promise<ActivateSiteTrackingTrialResult> {
    console.log('activateSiteTrackingTrial');
    await timeout(1500);
    return { success: true };
  }

  public async sendResetPasswordEmail(model: ForgotPasswordModel): Promise<ForgotPasswordResult> {
    console.log('sendResetPasswordEmail', model);
    await timeout(1500);
    return { success: true };
  }
}
