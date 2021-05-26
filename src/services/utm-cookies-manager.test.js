import { UtmCookiesManager } from './utm-cookies-manager';
import { FakeLocalStorage } from './test-utils/local-storage-double';

const saveMockDataInStorage = (utmCookiesManager, storage) =>
  utmCookiesManager.setCookieEntry({
    storage,
    UTMSource: 'source',
    UTMCampaign: 'campaign',
    UTMMedium: 'medium',
    UTMTerm: 'term',
    gclid: 'gclid',
  });

describe('Utm cookies manager', () => {
  let utmCookiesManager;
  let storage;

  beforeEach(() => {
    // Arrange
    utmCookiesManager = new UtmCookiesManager();
    storage = new FakeLocalStorage();
  });

  it('should initialize add only an entry per instance', () => {
    // Act
    saveMockDataInStorage(utmCookiesManager, storage);
    saveMockDataInStorage(utmCookiesManager, storage);

    // Assert
    expect(utmCookiesManager.getUtmCookie(storage).length).toBe(1);
  });

  it('should add utms into utmCookie', () => {
    // Act
    saveMockDataInStorage(utmCookiesManager, storage);

    // Assert
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMSource).toBe('source');
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMCampaign).toBe('campaign');
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMMedium).toBe('medium');
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMTerm).toBe('term');
    expect(utmCookiesManager.getUtmCookie(storage)[0].gclid).toBe('gclid');
  });
});
