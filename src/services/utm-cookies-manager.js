export class UtmCookiesManager {
  constructor(document) {
    this.cookieName = 'UtmCookies';
    this.document = document;
    this.hasRegistered = false;
  }

  setCookieEntry(utmParams) {
    const hasGclid = utmParams.gclid;
    const isFromFromdoppler = this.document?.referrer?.includes('fromdoppler.com');

    if (!this.hasRegistered && (!isFromFromdoppler || hasGclid)) {
      const newItem = {
        date: new Date().toISOString(),
        ...utmParams,
      };

      const utmCookies = this.getUtmCookie() ?? [];
      utmCookies.push(newItem);

      //we need to limit the number of entries to 10
      if (utmCookies.length > 10) {
        utmCookies.splice(0, utmCookies.length - 10);
      }

      const cookiesAsJsonString = JSON.stringify(utmCookies);
      this.document.cookie =
        this.cookieName +
        '=' +
        cookiesAsJsonString +
        '; domain=.fromdoppler.com; path=/; expires=Fri, 31 Dec 2038 23:59:59 GMT;';

      this.hasRegistered = true;
    }
  }

  getUtmCookie() {
    let cookieAsJSON = this.getCookieFromDocument(this.cookieName);
    if (cookieAsJSON && cookieAsJSON !== '') {
      return JSON.parse(cookieAsJSON);
    }
    return null;
  }

  getCookieFromDocument(cookieName) {
    let name = cookieName + '=';

    if (!this.document || !this.document.cookie) return null;

    let decodedCookie = decodeURIComponent(this.document.cookie);
    let ca = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
}
