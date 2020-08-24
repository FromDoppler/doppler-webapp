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
  PlanModel,
  userType,
  planType,
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
    // return { expectedError: { cancelatedAccountNotPayed: true } };
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

  public async getAllPlans(): Promise<PlanModel[]> {
    console.log('GetAllPlans');
    await timeout(1500);
    return [
      {
        id: 12,
        description: '500,000',
        fee: 444,
        userType: userType.HIGH_VOLUME,
        type: planType.STANDARD,
        emailsByMonth: 500000,
        subscribersByMonth: undefined,
        emailPrice: 0.0009,
        features: {
          emailParameter: false,
          cancelCampaign: false,
          siteTracking: false,
          smartCampaigns: false,
          shippingLimit: false,
        },
        advancedPayOptions: [
          {
            id: 62,
            idPlan: 12,
            paymentType: 1,
            discountPercentage: 0,
            monthsToPay: 1,
          },
          {
            id: 6,
            idPlan: 12,
            paymentType: 1,
            discountPercentage: 5,
            monthsToPay: 3,
          },
        ],
      },
      {
        id: 14,
        description: '500,000',
        fee: 444,
        userType: userType.HIGH_VOLUME,
        type: planType.PLUS,
        emailsByMonth: 500000,
        emailPrice: 0.0009,
        features: {
          emailParameter: true,
          cancelCampaign: false,
          siteTracking: true,
          smartCampaigns: false,
          shippingLimit: false,
        },
        advancedPayOptions: [
          {
            id: 62,
            idPlan: 12,
            paymentType: 1,
            discountPercentage: 0,
            monthsToPay: 1,
          },
        ],
      },
      {
        id: 19,
        description: '500,000',
        fee: 444,
        userType: userType.SUBSCRIBERS_MONTHLY,
        type: planType.STANDARD,
        emailsByMonth: undefined,
        subscribersByMonth: 1500,
        emailPrice: 0.0009,
        features: {
          emailParameter: true,
          cancelCampaign: false,
          siteTracking: true,
          smartCampaigns: false,
          shippingLimit: false,
        },
        advancedPayOptions: [
          {
            id: 62,
            idPlan: 12,
            paymentType: 1,
            discountPercentage: 0,
            monthsToPay: 1,
          },
          {
            id: 68,
            idPlan: 12,
            paymentType: 1,
            discountPercentage: 5,
            monthsToPay: 3,
          },
          {
            id: 69,
            idPlan: 12,
            paymentType: 1,
            discountPercentage: 10,
            monthsToPay: 6,
          },
        ],
      },
      {
        id: 18,
        description: '501-1500',
        fee: 15,
        userType: userType.SUBSCRIBERS_MONTHLY,
        type: planType.STANDARD,
        emailsByMonth: undefined,
        subscribersByMonth: 2500,
        emailPrice: undefined,
        features: {
          emailParameter: false,
          cancelCampaign: false,
          siteTracking: false,
          smartCampaigns: false,
          shippingLimit: false,
        },
        advancedPayOptions: [
          { id: 1, idPlan: 18, paymentType: 1, discountPercentage: 0, monthsToPay: 1 },
        ],
      },
      {
        id: 38,
        description: '501-1500',
        fee: 15,
        userType: userType.SUBSCRIBERS_MONTHLY,
        type: planType.PLUS,
        emailsByMonth: undefined,
        subscribersByMonth: 2500,
        emailPrice: undefined,
        features: {
          emailParameter: false,
          cancelCampaign: true,
          siteTracking: false,
          smartCampaigns: true,
          shippingLimit: false,
        },
        advancedPayOptions: [
          { id: 1, idPlan: 18, paymentType: 1, discountPercentage: 0, monthsToPay: 1 },
        ],
      },
    ];
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

  public async getPlansList(idPlan: number) {
    console.log('getPlansLists', idPlan);
    await timeout(1500);
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
