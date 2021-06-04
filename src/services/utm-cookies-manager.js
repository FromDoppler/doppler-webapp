export class UtmCookiesManager {
  constructor() {
    this.hasRegistered = false;
  }

  setCookieEntry({ storage, ...utmParams }) {
    if (!this.hasRegistered) {
      let utmCookies = JSON.parse(localStorage.getItem('UtmCookies')) ?? [];

      const newItem = {
        date: new Date().toISOString(),
        ...utmParams,
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
