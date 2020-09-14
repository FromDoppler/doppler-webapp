import urlParse from 'url-parse';
import { useEffect, useRef } from 'react';
import { Plan, PrepaidPack, FeaturedPlan } from './doppler-types';

declare global {
  interface Window {
    _LTracker: any;
    $zoho: any;
  }
}

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDataHubParams(partialUrl: string) {
  const parsedUrl = urlParse(partialUrl, false);
  return {
    navigatedPage: parsedUrl.pathname,
    hash: parsedUrl.hash,
    search: parsedUrl.query,
  };
}

export function useInterval({
  callback,
  delay,
  runOnStart,
}: {
  callback: () => void;
  delay: number;
  runOnStart: boolean;
}) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current();
    }
    if (delay !== null) {
      if (runOnStart) {
        savedCallback.current && savedCallback.current();
      }
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, runOnStart]);
}

interface ResponseWithEtag {
  headers: { [key: string]: string };
}

export class ResponseCache {
  private _cachedResults: { [key: string]: { etag: string; value: any } } = {};
  public getCachedOrMap<TResponse extends ResponseWithEtag, TResult>(
    func: Function,
    response: TResponse,
    mapFunction: (r: TResponse) => TResult,
  ) {
    if (!response.headers.etag) {
      return mapFunction(response);
    }
    const functionName = func.name;
    if (
      response.headers.etag !==
      (this._cachedResults[functionName] && this._cachedResults[functionName].etag)
    ) {
      this._cachedResults[functionName] = {
        value: mapFunction(response),
        etag: response.headers.etag,
      };
    }
    return this._cachedResults[functionName].value;
  }
}

export function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

export function getStartOfDate(date: Date) {
  return typeof date.getMonth === 'function'
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
    : undefined;
}

export function addLogEntry(data: any) {
  window._LTracker.push(data);
}

export function getSubscriberStatusCssClassName(status: string) {
  let subscriberCssClass = '';
  switch (status) {
    case 'active':
      subscriberCssClass = 'user--active';
      break;
    case 'inactive':
      subscriberCssClass = 'user--active-with-no-list';
      break;
    case 'unsubscribed_by_hard':
      subscriberCssClass = 'user--removed-hard-bounced';
      break;
    case 'unsubscribed_by_soft':
      subscriberCssClass = 'user--removed-soft-bounced';
      break;
    case 'unsubscribed_by_subscriber':
      subscriberCssClass = 'user--removed-subscriber';
      break;
    case 'unsubscribed_by_never_open':
      subscriberCssClass = 'user--removed-no-openings';
      break;
    case 'pending':
      subscriberCssClass = 'user--pending';
      break;
    case 'unsubscribed_by_client':
      subscriberCssClass = 'user--removed-client';
      break;
    case 'standBy':
      subscriberCssClass = 'user--stand-by';
      break;
    default:
      break;
  }
  return subscriberCssClass;
}

export function extractParameter(
  location: any,
  parseQueryStringFunction: any,
  paramLowercase: string,
  paramUppercase?: string,
) {
  const parsedQuery = location && location.search && parseQueryStringFunction(location.search);
  return (
    (parsedQuery &&
      (parsedQuery[paramLowercase] || (!!paramUppercase && parsedQuery[paramUppercase]))) ||
    null
  );
}

export function isWhitelisted(url: string) {
  const loginWhitelist = [
    'https://academy.fromdoppler.com/',
    'http://academy.fromdoppler.com/',
    'http://prod.doppleracademy.com/',
    'https://prod.doppleracademy.com/',
    'https://doppleracademy.com/',
    'http://doppleracademy.com/',
    'https://app2.bancoprovinciamail.com.ar/',
    'https://app2.fromdoppler.com/',
    'http://localhost:',
    'http://localhost/',
    'https://localhost:',
    'https://localhost/',
    'https://appint.fromdoppler.com/',
    'https://appqa.fromdoppler.com/',
    'https://qa.doppleracademy.com',
    'https://goemms.com/',
    'http://goemms.com/',
  ];
  return !!url && loginWhitelist.some((element) => url.startsWith(element));
}

export const replaceSpaceWithSigns = (url: string) => {
  return url ? url.replace(' ', '+') : '';
};

const urlsWebApp: any = [
  {
    url: '/reports',
    menu: 'reportMenu',
    subMenu: 'webapp',
  },
  {
    url: '/integrations/shopify',
    menu: '',
    subMenu: '',
  },
  {
    url: '/reports/master-subscriber',
    menu: 'reportMenu',
    subMenu: '',
  },
  {
    url: '/reports/subscriber-history',
    menu: 'listMenu',
    subMenu: '',
  },
  {
    url: '/reports/subscriber-gdpr',
    menu: 'listMenu',
    subMenu: '',
  },
  {
    url: '/reports/partials-campaigns',
    menu: 'reportMenu',
    subMenu: '',
  },
];

export function getCurrentPageForUrl(currentUrl: string): any {
  return urlsWebApp.find((item: any) => item.url === currentUrl);
}

export function isZohoChatOnline() {
  const currentDate = new Date();
  // TODO: allow to configure the schedule in a settings file.
  // (UTC-03:00) City of Buenos Aires from 8:00 to 20:00
  return currentDate.getUTCHours() >= 11 && currentDate.getUTCHours() < 23;
}

export function openZohoChatWithMessage(message: string) {
  window.$zoho.salesiq.chat.start();
  window.$zoho.salesiq.visitor.question(message);
}

export function getPlanFee(plan: Plan): number {
  return plan.type === 'prepaid' ? (plan as PrepaidPack).price : (plan as FeaturedPlan).fee;
}
