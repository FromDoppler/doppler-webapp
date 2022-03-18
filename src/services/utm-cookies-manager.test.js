import { UtmCookiesManager } from './utm-cookies-manager';
import { FakeLocalStorage } from './test-utils/local-storage-double';

const utmsParameterName = ['UTMSource', 'UTMCampaign', 'UTMMedium', 'UTMTerm', 'gclid'];

describe('Utm cookies manager', () => {
  let utmCookiesManager;
  let storage;

  beforeEach(() => {
    // Arrange
    const fakeDocument = { cookie: '' };
    utmCookiesManager = new UtmCookiesManager(fakeDocument);
  });

  it('should initialize add only an entry per instance', () => {
    // Arrange
    const utmParams = {
      UTMSource: 'source',
      UTMCampaign: 'campaign',
      UTMMedium: 'medium',
      UTMTerm: 'term',
      gclid: 'gclid',
    };

    // Act
    utmCookiesManager.setCookieEntry({ ...utmParams });
    utmCookiesManager.setCookieEntry({ ...utmParams });

    // Assert
    expect(utmCookiesManager.getUtmCookie().length).toBe(1);
  });

  it('should add utms into utmCookie', () => {
    // Arrange
    const utmParams = {
      UTMSource: 'source',
      UTMCampaign: 'campaign',
      UTMMedium: 'medium',
      UTMTerm: 'term',
      gclid: 'gclid',
    };

    // Act
    utmCookiesManager.setCookieEntry({ storage, ...utmParams });

    // Assert
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMSource).toBe('source');
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMCampaign).toBe('campaign');
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMMedium).toBe('medium');
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMTerm).toBe('term');
    expect(utmCookiesManager.getUtmCookie(storage)[0].gclid).toBe('gclid');
  });

  it('should add UTMSource parameter into utmCookie', () => {
    const utmExclude = utmsParameterName.filter((item) => item !== 'UTMSource');

    // Act
    utmCookiesManager.setCookieEntry({ storage, UTMSource: 'a-value' });

    // Assert
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMSource).toBe('a-value');
    utmExclude.map((utmKey) =>
      expect(utmCookiesManager.getUtmCookie(storage)[0][utmKey]).toBeUndefined(),
    );
  });

  it('should add UTMCampaign parameter into utmCookie', () => {
    const utmExclude = utmsParameterName.filter((item) => item !== 'UTMCampaign');

    // Act
    utmCookiesManager.setCookieEntry({ storage, UTMCampaign: 'a-value' });

    // Assert
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMCampaign).toBe('a-value');
    utmExclude.map((utmKey) =>
      expect(utmCookiesManager.getUtmCookie(storage)[0][utmKey]).toBeUndefined(),
    );
  });

  it('should add UTMMedium parameter into utmCookie', () => {
    const utmExclude = utmsParameterName.filter((item) => item !== 'UTMMedium');

    // Act
    utmCookiesManager.setCookieEntry({ UTMMedium: 'a-value' });

    // Assert
    const cookieArray = utmCookiesManager.getUtmCookie(storage);
    expect(cookieArray[cookieArray.length - 1].UTMMedium).toBe('a-value');

    utmExclude.map((utmKey) => expect(cookieArray[0][utmKey]).toBeUndefined());
  });

  it('should add UTMTerm parameter into utmCookie', () => {
    const utmExclude = utmsParameterName.filter((item) => item !== 'UTMTerm');

    // Act
    utmCookiesManager.setCookieEntry({ storage, UTMTerm: 'a-value' });

    // Assert
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMTerm).toBe('a-value');
    utmExclude.map((utmKey) =>
      expect(utmCookiesManager.getUtmCookie(storage)[0][utmKey]).toBeUndefined(),
    );
  });

  it('should add gclid parameter into utmCookie', () => {
    const utmExclude = utmsParameterName.filter((item) => item !== 'gclid');

    // Act
    utmCookiesManager.setCookieEntry({ storage, gclid: 'a-value' });

    // Assert
    expect(utmCookiesManager.getUtmCookie(storage)[0].gclid).toBe('a-value');
    utmExclude.map((utmKey) =>
      expect(utmCookiesManager.getUtmCookie(storage)[0][utmKey]).toBeUndefined(),
    );
  });

  it('the utms parameters should not be stored into utmCookie', () => {
    // Act
    utmCookiesManager.setCookieEntry({ storage });

    // Assert
    utmsParameterName.map((utmKey) =>
      expect(utmCookiesManager.getUtmCookie(storage)[0][utmKey]).toBeUndefined(),
    );
  });
});
