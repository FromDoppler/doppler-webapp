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
  RequestAgenciesDemoModel,
  RequestAgenciesDemoResult,
  RequestExclusiveFeaturesDemoResult,
  RequestUpgradeModel,
  ReturnUpgradeFormResult,
  MaxSubscribersData,
  AnswerType,
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
    // return { expectedError: { blockedAccountCMDisabled: true, errorMessage: clientmanager - clientmanager@email.com } };
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

  public async getAllPlans(): Promise<any[]> {
    await timeout(1500);
    return allPlans;
  }

  public async getLandingPagesAmount(): Promise<any> {
    await timeout(1500);
    return 0;
  }

  public async registerUser(model: UserRegistrationModel): Promise<UserRegistrationResult> {
    console.log(this.registerUser, model);
    await timeout(1500);
    return { success: true };
    // return { expectedError: { registerDenied: true } };
    // return {expectedError: {invalidDomain: true } };
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
        idUser: 10000,
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

  public async getSurveyFormStatus() {
    console.log('getSurveyFormStatus');
    await timeout(1500);

    return {
      success: true,
      value: { surveyFormCompleted: true },
    };
  }

  public async setSurveyToCompleted() {
    console.log('setSurveyToCompleted');
    await timeout(1500);

    return {
      success: true,
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

  public async isDopplerMVCUp(): Promise<boolean> {
    await timeout(1500);
    console.log('isDopplerMVCUp');
    return true;
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

  public async requestAgenciesDemo(
    model: RequestAgenciesDemoModel,
  ): Promise<RequestAgenciesDemoResult> {
    console.log('requestAgenciesDemo', model);
    await timeout(1500);
    return { success: true };
  }

  public async requestExclusiveFeaturesDemo(
    model: RequestExclusiveFeaturesDemoResult,
  ): Promise<RequestExclusiveFeaturesDemoResult> {
    console.log('requestExclusiveFeaturesDemo', model);
    await timeout(1500);
    return { success: true };
  }

  public async requestSuggestionUpgradeForm(
    model: RequestUpgradeModel,
  ): Promise<ReturnUpgradeFormResult> {
    console.log('requestSuggestionUpgradeForm', model);
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
  public async getMaxSubscribersData(): Promise<MaxSubscribersData> {
    await 1500;
    return maxSubscribersData;
  }

  public async sendMaxSubscribersData(maxSubscribersData: MaxSubscribersData): Promise<boolean> {
    await 1500;
    return true;
  }

  public async sendAcceptButtonAction(): Promise<boolean> {
    await 1500;
    return true;
  }
}

// Dummy Data
export const allPlans = [
  {
    type: 'prepaid',
    id: 1,
    name: '1500-CREDITS',
    credits: 1500,
    price: 15,
  },
  {
    type: 'prepaid',
    id: 2,
    name: '2500-CREDITS',
    credits: 2500,
    price: 45,
  },
  {
    type: 'prepaid',
    id: 3,
    name: '5000-CREDITS',
    credits: 5000,
    price: 85,
  },
  {
    type: 'prepaid',
    id: 4,
    name: '10000-CREDITS',
    credits: 10000,
    price: 120,
  },
  {
    type: 'prepaid',
    id: 5,
    name: '15000-CREDITS',
    credits: 15000,
    price: 185,
  },
  {
    type: 'prepaid',
    id: 6,
    name: '25000-CREDITS',
    credits: 25000,
    price: 250,
  },
  {
    type: 'prepaid',
    id: 7,
    name: '50000-CREDITS',
    credits: 50000,
    price: 400,
  },
  {
    type: 'prepaid',
    id: 8,
    name: '100000-CREDITS',
    credits: 100000,
    price: 600,
  },
  {
    type: 'monthly-deliveries',
    id: 11,
    name: '700000-EMAILS',
    emailsByMonth: 700000,
    extraEmailPrice: 0.00087,
    fee: 610,
    billingCycleDetails: [
      { id: 54, idPlan: 11, paymentType: 'CC', discountPercentage: 0, billingCycle: 'monthly' },
      {
        id: 56,
        idPlan: 11,
        paymentType: 'CC',
        discountPercentage: 5,
        billingCycle: 'quarterly',
      },
      {
        id: 58,
        idPlan: 11,
        paymentType: 'CC',
        discountPercentage: 15,
        billingCycle: 'half-yearly',
      },
      { id: 60, idPlan: 11, paymentType: 'CC', discountPercentage: 25, billingCycle: 'yearly' },
    ],
  },
  {
    type: 'monthly-deliveries',
    id: 14,
    name: '700000-EMAILS',
    emailsByMonth: 700000,
    extraEmailPrice: 0.00087,
    fee: 810,
    billingCycleDetails: [
      { id: 54, idPlan: 11, paymentType: 'CC', discountPercentage: 0, billingCycle: 'monthly' },
      {
        id: 56,
        idPlan: 14,
        paymentType: 'CC',
        discountPercentage: 5,
        billingCycle: 'quarterly',
      },
      {
        id: 58,
        idPlan: 14,
        paymentType: 'CC',
        discountPercentage: 15,
        billingCycle: 'half-yearly',
      },
      { id: 60, idPlan: 14, paymentType: 'CC', discountPercentage: 25, billingCycle: 'yearly' },
    ],
  },
  {
    type: 'subscribers',
    id: 19,
    name: '2500-SUBSCRIBERS',
    subscriberLimit: 2500,
    fee: 29,
    billingCycleDetails: [
      { id: 8, idPlan: 19, paymentType: 'CC', discountPercentage: 0, billingCycle: 'monthly' },
      {
        id: 9,
        idPlan: 19,
        paymentType: 'CC',
        discountPercentage: 5,
        billingCycle: 'quarterly',
      },
      {
        id: 11,
        idPlan: 19,
        paymentType: 'CC',
        discountPercentage: 15,
        billingCycle: 'half-yearly',
      },
      { id: 13, idPlan: 19, paymentType: 'CC', discountPercentage: 25, billingCycle: 'yearly' },
    ],
  },
  {
    type: 'subscribers',
    id: 19,
    name: '3500-SUBSCRIBERS',
    subscriberLimit: 3500,
    fee: 32,
    billingCycleDetails: [
      { id: 8, idPlan: 19, paymentType: 'CC', discountPercentage: 0, billingCycle: 'monthly' },
      {
        id: 9,
        idPlan: 19,
        paymentType: 'CC',
        discountPercentage: 5,
        billingCycle: 'quarterly',
      },
      {
        id: 11,
        idPlan: 19,
        paymentType: 'CC',
        discountPercentage: 15,
        billingCycle: 'half-yearly',
      },
      { id: 13, idPlan: 19, paymentType: 'CC', discountPercentage: 25, billingCycle: 'yearly' },
    ],
  },
  {
    type: 'subscribers',
    id: 32,
    name: '2500-SUBSCRIBERS',
    subscriberLimit: 2500,
    fee: 40,
    billingCycleDetails: [
      { id: 8, idPlan: 19, paymentType: 'CC', discountPercentage: 0, billingCycle: 'monthly' },
      {
        id: 9,
        idPlan: 19,
        paymentType: 'CC',
        discountPercentage: 5,
        billingCycle: 'quarterly',
      },
      {
        id: 11,
        idPlan: 19,
        paymentType: 'CC',
        discountPercentage: 15,
        billingCycle: 'half-yearly',
      },
      { id: 13, idPlan: 19, paymentType: 'CC', discountPercentage: 25, billingCycle: 'yearly' },
    ],
  },
];

export const maxSubscribersData: MaxSubscribersData = {
  questionsList: [
    {
      answer: {
        answerType: AnswerType[1],
        answerOptions: [],
        value: '',
        optionsSelected: [],
      },
      question: 'Nombre',
    },
    {
      answer: {
        answerType: AnswerType[1],
        answerOptions: [],
        value: '',
        optionsSelected: [],
      },
      question: 'Apellido',
    },
    {
      answer: {
        answerType: AnswerType[1],
        answerOptions: [],
        value: '',
        optionsSelected: [],
      },
      question: 'Email',
    },
    {
      answer: {
        answerType: AnswerType[1],
        answerOptions: [],
        value: '',
        optionsSelected: [],
      },
      question: 'Teléfono',
    },
    {
      answer: {
        answerType: AnswerType[3],
        answerOptions: [
          'Sitio Web',
          'Evento',
          'Landing Page',
          'CRM',
          'Agenda personal de contactos',
          'Formulario en tienda física/offline',
          'Otros',
        ],
        value: '',
        optionsSelected: [],
      },
      question: '¿Cuál es la procedencia de tus Suscriptores?',
    },
    {
      answer: {
        answerType: AnswerType[2],
        answerOptions: ['Opt-in', 'Doble Opt-in', 'Manual'],
        value: '',
        optionsSelected: [],
      },
      question: '¿Cómo fue el método de recolección de datos?',
    },
    {
      answer: {
        answerType: AnswerType[6],
        answerOptions: [],
        value: '',
        optionsSelected: [],
      },
      question: 'URL de registración:',
    },
  ],
  isSentSuccessEmail: false,
  urlReferrer: '',
  urlHelp: 'http://help.fromdoppler.com/por-que-debo-completar-un-formulario-al-cargar-mis-listas/',
};
