export class UtmCookiesManager {
  constructor() {
    this.hasRegistered = false;
  }

  setCookieEntry(storage, utmSource, utmCampaign, utmMedium, utmTerm) {
    if (!this.hasRegistered) {
      let utmCookies = JSON.parse(localStorage.getItem('UtmCookies')) ?? [];

      const newItem = {
        date: new Date().toISOString(),
        UTMSource: utmSource,
        UTMCampaign: utmCampaign,
        UTMMedium: utmMedium,
        UTMTerm: utmTerm,
      };
      utmCookies.push(newItem);

      storage.setItem('UtmCookies', JSON.stringify(utmCookies.slice(-10)));

      this.hasRegistered = true;
    }
  }

  getUtmCookie(storage) {
    return JSON.parse(storage.getItem('UtmCookies'));
  }
}
