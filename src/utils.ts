import urlParse from 'url-parse';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    _LTracker: any;
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
    case 'stand_by':
      subscriberCssClass = 'user--stand-by';
      break;
    default:
      break;
  }
  return subscriberCssClass;
}
