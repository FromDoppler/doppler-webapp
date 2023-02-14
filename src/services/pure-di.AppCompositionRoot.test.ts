import axios from 'axios';
import { AppCompositionRoot } from './pure-di';

const spyAxiosCreate = jest.spyOn(axios, 'create');

describe('AppCompositionRoot', () => {
  beforeEach(() => {
    spyAxiosCreate.mockClear();
  });

  function verifyInstances(compositionRoot: AppCompositionRoot, expectedInstanceNames: string[]) {
    const createdInstances = Object.keys((compositionRoot as any).instances).sort();
    expect(createdInstances).toEqual(expectedInstanceNames.sort());
  }

  it('should not copy (nor resolve) getters on spread', () => {
    const sut = new AppCompositionRoot();
    expect(spyAxiosCreate).not.toHaveBeenCalled();
    verifyInstances(sut, []);

    // Act
    const spread = { ...sut };

    // Assert
    expect(spread).not.toBeNull();
    expect(Object.keys(spread)).not.toContain('dopplerLegacyClient');
    expect(Object.keys(spread)).not.toContain('axiosStatic');
    expect(spyAxiosCreate).not.toHaveBeenCalled();
    verifyInstances(sut, []);
  });

  it('should not accept modify properties manually', () => {
    // Arrange
    const sut = new AppCompositionRoot();
    verifyInstances(sut, []);
    expect(spyAxiosCreate).not.toHaveBeenCalled();
    const configuration = {
      dopplerLegacyKeepAliveMilliseconds: 123,
      dopplerLegacyUrl: 'http://legacy.localhost',
    };

    const action = () => {
      // Act
      (sut as any).appConfiguration = configuration;
    };

    // Assert
    expect(action).toThrowError(TypeError);
  });

  it('should create axios instance after create doppler legacy client', () => {
    // Arrange
    const sut = new AppCompositionRoot();
    expect(spyAxiosCreate).not.toHaveBeenCalled();
    verifyInstances(sut, []);

    // Act
    const result = sut.dopplerLegacyClient;

    // Assert
    expect(result).not.toBeNull();
    expect(spyAxiosCreate).toHaveBeenCalledTimes(1);
    verifyInstances(sut, ['axiosStatic', 'appConfiguration', 'dopplerLegacyClient', 'window']);
  });

  it('should make honor to injected configuration when creating axios instance', () => {
    // Arrange
    const configuration = {
      dopplerLegacyKeepAliveMilliseconds: 123,
      dopplerLegacyUrl: 'http://legacy.localhost',
      dopplerBillingApiUrl: 'http://subdomain.localhost',
      dopplerSystemUsageApiUrl: 'http://subdomain.localhost',
      dopplerSitesUrl: 'http://subdomain.localhost',
      dopplerContactPolicyApiUrl: 'http://subdomain.localhost',
      datahubUrl: 'http://subdomain.localhost',
      recaptchaPublicKey: 'publick-key',
    };

    const sut = new AppCompositionRoot({ appConfiguration: configuration });
    verifyInstances(sut, ['appConfiguration']);
    expect(spyAxiosCreate).not.toHaveBeenCalled();

    // Act
    const result = sut.dopplerLegacyClient;

    // Assert
    expect(result).not.toBeNull();
    expect(spyAxiosCreate).toHaveBeenCalledTimes(1);
    expect(spyAxiosCreate).toHaveBeenCalledWith({
      baseURL: configuration.dopplerLegacyUrl,
      withCredentials: true,
    });
    verifyInstances(sut, ['axiosStatic', 'appConfiguration', 'dopplerLegacyClient', 'window']);
  });

  it('should not create axios instance after when doppler legacy client is a double', () => {
    // Arrange
    const dopplerLegacyClientDouble = {} as any;
    const sut = new AppCompositionRoot({
      dopplerLegacyClient: dopplerLegacyClientDouble,
    });
    expect(spyAxiosCreate).not.toHaveBeenCalled();
    verifyInstances(sut, ['dopplerLegacyClient']);

    // Act
    const result = sut.dopplerLegacyClient;

    // Assert
    expect(result).toStrictEqual(dopplerLegacyClientDouble);
    expect(spyAxiosCreate).not.toHaveBeenCalled();
    verifyInstances(sut, ['dopplerLegacyClient']);
  });
});
