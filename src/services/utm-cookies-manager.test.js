import { UtmCookiesManager } from './utm-cookies-manager';
import { FakeLocalStorage } from './test-utils/local-storage-double';

describe('Utm cookies manager', () => {
  it('should initialize add only an entry per instance', () => {
    // Arrange
    const utmCookiesManager = new UtmCookiesManager();
    const storage = new FakeLocalStorage();
    // Act
    utmCookiesManager.setCookieEntry(storage, 'source', 'campaign', 'medium', 'term');
    utmCookiesManager.setCookieEntry(storage, 'source', 'campaign', 'medium', 'term');
    // Assert
    expect(utmCookiesManager.getUtmCookie(storage).length).toBe(1);
  });

  it('should add utms into utmCookie', () => {
    // Arrange
    const utmCookiesManager = new UtmCookiesManager();
    const storage = new FakeLocalStorage();
    // Act
    utmCookiesManager.setCookieEntry(storage, 'source', 'campaign', 'medium', 'term');
    // Assert
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMSource).toBe('source');
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMCampaign).toBe('campaign');
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMMedium).toBe('medium');
    expect(utmCookiesManager.getUtmCookie(storage)[0].UTMTerm).toBe('term');
  });
});
