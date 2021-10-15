import axios from 'axios';
import { HttpDopplerLegacyClient } from './doppler-legacy-client';
import { parsePlan } from './planMapping';
jest.mock('axios');

const userData = {
  data: {
    nav: [
      {
        title: 'Campañas',
        url: 'https://appint.fromdoppler.net/Campaigns/Draft/',
        isSelected: false,
      },
      {
        title: 'Automation',
        url: 'https://appint.fromdoppler.net/Automation/Automation/AutomationApp/',
        isSelected: false,
      },
    ],
    user: {
      email: 'fcoronel@makingsense.com',
      fullname: 'Federico Coronel',
      plan: {
        planType: '3',
        description: 'Créditos disponibles',
        isSubscribers: 'true',
        maxSubscribers: '0',
        remainingCredits: '85899',
        buttonText: 'COMPRAR',
        buttonUrl: 'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/BuyCreditsStep1',
      },
      sms: {
        description: 'Créditos disponibles',
        remainingCredits: '555',
        buttonText: 'CARGAR',
        buttonUrl:
          'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/GetSmsConfiguration',
      },
      lang: 'es',
      avatar: {
        text: 'FC',
        color: '#EE9C70',
      },
      nav: [
        {
          title: 'Panel de Control',
          url: 'https://appint.fromdoppler.net/ControlPanel/ControlPanel/',
          isEnabled: false,
          isSelected: false,
          idHTML: 'controlPanel',
        },
        {
          title: 'Salir',
          url: 'https://appint.fromdoppler.net/SignIn/SignOut',
          isEnabled: false,
          isSelected: false,
          idHTML: 'signOut',
        },
      ],
    },
    alert: {
      type: 'blocker',
      message: 'Necesitamos verificar el origen de tus Suscriptores.',
      button: {
        action: 'validateSubscribersPopup',
        text: 'Verificar Ahora',
      },
    },
  },
};

const montlhyRawPlan = {
  data: {
    data: [
      {
        IdUserTypePlan: 43,
        Description: '3,000,000',
        EmailQty: 3000000,
        Fee: 1836,
        ExtraEmailCost: 0.00061,
        IdUserType: 2,
        SubscribersQty: null,
        PlanType: 2,
        DiscountXPlan: [
          {
            IdDiscountPlan: 214,
            IdUserTypePlan: 43,
            Description: null,
            DiscountPlanFee: 0,
            IdPaymentMethod: 1,
            MonthPlan: 1,
            ApplyPromo: true,
            IdItem: 0,
          },
          {
            IdDiscountPlan: 215,
            IdUserTypePlan: 43,
            Description: null,
            DiscountPlanFee: 0,
            IdPaymentMethod: 3,
            MonthPlan: 1,
            ApplyPromo: true,
            IdItem: 0,
          },
          {
            IdDiscountPlan: 216,
            IdUserTypePlan: 43,
            Description: null,
            DiscountPlanFee: 5,
            IdPaymentMethod: 1,
            MonthPlan: 3,
            ApplyPromo: false,
            IdItem: 0,
          },
          {
            IdDiscountPlan: 217,
            IdUserTypePlan: 43,
            Description: null,
            DiscountPlanFee: 5,
            IdPaymentMethod: 3,
            MonthPlan: 3,
            ApplyPromo: false,
            IdItem: 0,
          },
          {
            IdDiscountPlan: 218,
            IdUserTypePlan: 43,
            Description: null,
            DiscountPlanFee: 15,
            IdPaymentMethod: 1,
            MonthPlan: 6,
            ApplyPromo: false,
            IdItem: 0,
          },
          {
            IdDiscountPlan: 219,
            IdUserTypePlan: 43,
            Description: null,
            DiscountPlanFee: 15,
            IdPaymentMethod: 3,
            MonthPlan: 6,
            ApplyPromo: false,
            IdItem: 0,
          },
          {
            IdDiscountPlan: 220,
            IdUserTypePlan: 43,
            Description: null,
            DiscountPlanFee: 25,
            IdPaymentMethod: 1,
            MonthPlan: 12,
            ApplyPromo: false,
            IdItem: 0,
          },
          {
            IdDiscountPlan: 221,
            IdUserTypePlan: 43,
            Description: null,
            DiscountPlanFee: 25,
            IdPaymentMethod: 3,
            MonthPlan: 12,
            ApplyPromo: false,
            IdItem: 0,
          },
        ],
        EmailParameterEnabled: false,
        CancelCampaignEnabled: false,
        SiteTrackingLicensed: false,
        SmartCampaignsEnabled: false,
        ShippingLimitEnabled: false,
      },
    ],
  },
};

describe('Doppler legacy client', () => {
  beforeEach(() => {
    axios.mockClear();
    axios.create.mockImplementation(() => axios);
  });

  it('should throw error, when receives an error from doppler', async () => {
    // Arrange
    const sut = new HttpDopplerLegacyClient({
      axiosStatic: axios,
      baseUrl: 'http://localhost:52191',
    });
    axios.get.mockImplementation(() => ({
      data: {
        success: false,
        error: 'Error de prueba',
      },
    }));
    const action = async () => {
      await sut.getUserData();
    };
    // Assert
    expect(action()).rejects.toEqual(new Error('Doppler Error: Error de prueba'));
  });

  it('should throw error, when response is empty', async () => {
    // Arrange
    const sut = new HttpDopplerLegacyClient({
      axiosStatic: axios,
      baseUrl: 'http://localhost:52191',
    });
    axios.get.mockImplementation(() => {});
    // Act
    const action = async () => {
      await sut.getUserData();
    };
    // Assert
    expect(action()).rejects.toEqual(new Error('Empty Doppler response'));
  });

  it('should return data, when logged into doppler and there are no errors', async () => {
    // Arrange
    const sut = new HttpDopplerLegacyClient({
      axiosStatic: axios,
      baseUrl: 'http://localhost:52191',
    });
    axios.get.mockImplementation(() => userData);
    // Act
    const action = await sut.getUserData();
    // Assert
    expect(action).toBeDefined();
    expect(action.error).toBeUndefined();
    expect(action.nav.length).not.toEqual(0);
    expect(action.user).toBeDefined();
  });

  it('should return data and idUser = 0, when token hasnt nameId (IdUser) property', async () => {
    // Arrange
    const sut = new HttpDopplerLegacyClient({
      axiosStatic: axios,
      baseUrl: 'http://localhost:52191',
    });

    const userDataWithoutNameIdinJwtToken = {
      data: {
        jwtToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1N1IjpmYWxzZSwic3ViIjoiY2Jlcm5hdEBnZXRjcy5jb' +
          '20iLCJjdXN0b21lcklkIjoiMTAyNCIsImRhdGFodWJDdXN0b21lcklkIjoiMTAyNCIsImlhdCI6MTU1NjU0NTQ' +
          '2MSwiZXhwIjoxNTU2NTQ3MjYxfQ.meC1sFsC7m8nGFfcK2oih1hqdKQ4Lj81O5rN_-awOcM_JEe9ddviocPbYA' +
          'wg64L6nC6b0a7J5xmTmiW_-MAIEIg',
        nav: [
          {
            title: 'Campañas',
            url: 'https://appint.fromdoppler.net/Campaigns/Draft/',
            isSelected: false,
          },
          {
            title: 'Automation',
            url: 'https://appint.fromdoppler.net/Automation/Automation/AutomationApp/',
            isSelected: false,
          },
        ],
        user: {
          email: 'test@test.com',
          fullname: 'User Test',
          plan: {
            planType: '3',
            description: 'Créditos disponibles',
            isSubscribers: 'true',
            maxSubscribers: '0',
            remainingCredits: '85899',
            buttonText: 'COMPRAR',
            buttonUrl:
              'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/BuyCreditsStep1',
          },
          sms: {
            description: 'Créditos disponibles',
            remainingCredits: '555',
            buttonText: 'CARGAR',
            buttonUrl:
              'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/GetSmsConfiguration',
          },
          lang: 'es',
          avatar: {
            text: 'FC',
            color: '#EE9C70',
          },
          nav: [
            {
              title: 'Panel de Control',
              url: 'https://appint.fromdoppler.net/ControlPanel/ControlPanel/',
              isEnabled: false,
              isSelected: false,
              idHTML: 'controlPanel',
            },
            {
              title: 'Salir',
              url: 'https://appint.fromdoppler.net/SignIn/SignOut',
              isEnabled: false,
              isSelected: false,
              idHTML: 'signOut',
            },
          ],
        },
        alert: {
          type: 'blocker',
          message: 'Necesitamos verificar el origen de tus Suscriptores.',
          button: {
            action: 'validateSubscribersPopup',
            text: 'Verificar Ahora',
          },
        },
      },
    };

    axios.get.mockImplementation(() => userDataWithoutNameIdinJwtToken);

    // Act
    const action = await sut.getUserData();

    // Assert
    expect(action).toBeDefined();
    expect(action.error).toBeUndefined();
    expect(action.nav.length).not.toEqual(0);
    expect(action.user).toBeDefined();
    expect(action.user.idUser).toEqual(0);
  });

  it('should return data and idUser != 0, when token has nameId (IdUser) property', async () => {
    // Arrange
    const sut = new HttpDopplerLegacyClient({
      axiosStatic: axios,
      baseUrl: 'http://localhost:52191',
    });

    const userDataWithNameIdinJwtToken = {
      data: {
        jwtToken:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' +
          'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgdXNlciIsIm5hbWVpZCI6MTAwMCwianRpIjoiMjQ' +
          '0N2M2YTItMzM2ZS00Mzc2LTljZDAtOGVmMmFkNmRhMDJjIiwiaWF0IjoxNjAxMzE4NDkwLCJleHAiOjE2MD' +
          'EzOTI2OTJ9.tJJ4R-Co54pmMrxeBbMycSsu6FPtWqdISKPChUbx9bE',
        nav: [
          {
            title: 'Campañas',
            url: 'https://appint.fromdoppler.net/Campaigns/Draft/',
            isSelected: false,
          },
          {
            title: 'Automation',
            url: 'https://appint.fromdoppler.net/Automation/Automation/AutomationApp/',
            isSelected: false,
          },
        ],
        user: {
          email: 'test@test.com',
          fullname: 'User Test',
          plan: {
            planType: '3',
            description: 'Créditos disponibles',
            isSubscribers: 'true',
            maxSubscribers: '0',
            remainingCredits: '85899',
            buttonText: 'COMPRAR',
            buttonUrl:
              'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/BuyCreditsStep1',
          },
          sms: {
            description: 'Créditos disponibles',
            remainingCredits: '555',
            buttonText: 'CARGAR',
            buttonUrl:
              'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/GetSmsConfiguration',
          },
          lang: 'es',
          avatar: {
            text: 'FC',
            color: '#EE9C70',
          },
          nav: [
            {
              title: 'Panel de Control',
              url: 'https://appint.fromdoppler.net/ControlPanel/ControlPanel/',
              isEnabled: false,
              isSelected: false,
              idHTML: 'controlPanel',
            },
            {
              title: 'Salir',
              url: 'https://appint.fromdoppler.net/SignIn/SignOut',
              isEnabled: false,
              isSelected: false,
              idHTML: 'signOut',
            },
          ],
        },
        alert: {
          type: 'blocker',
          message: 'Necesitamos verificar el origen de tus Suscriptores.',
          button: {
            action: 'validateSubscribersPopup',
            text: 'Verificar Ahora',
          },
        },
      },
    };

    axios.get.mockImplementation(() => userDataWithNameIdinJwtToken);

    // Act
    const action = await sut.getUserData();

    // Assert
    expect(action).toBeDefined();
    expect(action.error).toBeUndefined();
    expect(action.nav.length).not.toEqual(0);
    expect(action.user).toBeDefined();
    expect(action.user.idUser).toEqual(1000);
  });

  it('should parse a monthly plan without discounts', async () => {
    //Arrange
    const sut = new HttpDopplerLegacyClient({
      axiosStatic: axios,
      baseUrl: 'http://localhost:52191',
    });
    axios.get.mockImplementation(() => montlhyRawPlan);
    // Act
    const planList = await sut.getAllPlans(parsePlan);
    // Assert
    expect(planList).toBeDefined();
    expect(planList[0].type).toBe('monthly-deliveries');
    expect(planList[0].billingCycleDetails).toBeUndefined();
  });
});
