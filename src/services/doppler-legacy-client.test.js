import axios from 'axios';
import { HttpDopplerLegacyClient } from './doppler-legacy-client';
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
        buttonUrl: 'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/GetSmsConfiguration',
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
});
