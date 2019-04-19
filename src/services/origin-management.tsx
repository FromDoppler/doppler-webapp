import React from 'react';
import { InjectAppServices, AppServices } from './pure-di';
import { withRouter } from 'react-router';
import queryString from 'query-string';

const DopplerFirstOriginLocalStorageKey = 'dopplerFirstOrigin.value';
const DopplerFirstOriginDateLocalStorageKey = 'dopplerFirstOrigin.date';

let firstOriginCache:
  | { readonly stored: true; readonly value: string; readonly unknown?: false }
  | { readonly stored: false; readonly value?: undefined; readonly unknown?: undefined }
  | { readonly unknown: true } = {
  unknown: true,
};

let currentOrigin: string | undefined;

function ensureFirstOriginCache(localStorage: Storage) {
  if (firstOriginCache.unknown) {
    const value = localStorage.getItem(DopplerFirstOriginLocalStorageKey);
    firstOriginCache = value ? { stored: true, value: value } : { stored: false };
  }
  return firstOriginCache;
}

export class OriginResolver {
  constructor(private localStorage: Storage) {}

  getFirstOrigin = () => ensureFirstOriginCache(this.localStorage).value;
  getCurrentOrigin = () => currentOrigin || 'login';
}

function extractOrigin(location: Location | null): string | null {
  const parsedQuery = location && location.search && queryString.parse(location.search);
  return ((parsedQuery && (parsedQuery['origin'] || parsedQuery['Origin'])) || null) as
    | string
    | null;
}

function _OriginCatcher({
  dependencies: { localStorage },
  location,
}: {
  dependencies: AppServices;
  location: Location;
}) {
  const output = <></>;

  const originFromUrl = extractOrigin(location);
  if (!originFromUrl) {
    return output;
  }

  currentOrigin = originFromUrl;

  // Optimization to avoid too much local storage usage
  const cache = ensureFirstOriginCache(localStorage);

  if (!cache.stored) {
    localStorage.setItem(DopplerFirstOriginLocalStorageKey, currentOrigin);
    localStorage.setItem(DopplerFirstOriginDateLocalStorageKey, new Date().toUTCString());
    firstOriginCache = { stored: true, value: currentOrigin };
  }

  return output;
}

export const OriginCatcher = withRouter(InjectAppServices(_OriginCatcher));
