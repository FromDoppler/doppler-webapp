import React from 'react';
import { InjectAppServices, AppServices } from './pure-di';
import { withRouter } from 'react-router';
import queryString from 'query-string';

const DopplerOriginLocalStorageKey = 'dopplerOrigin.value';
const DopplerOriginDateLocalStorageKey = 'dopplerOrigin.date';

let originIsInLocalStorage: boolean | null = null;

function _OriginCatcher({
  dependencies: { localStorage },
  location,
}: {
  dependencies: AppServices;
  location: Location;
}) {
  const output = <></>;
  const parsedQuery = (location && location.search && queryString.parse(location.search)) || null;
  const originFromUrl = parsedQuery && (parsedQuery['origin'] || parsedQuery['Origin']);

  if (!originFromUrl) {
    return output;
  }

  // Optimization to avoid too much local storage usage
  if (originIsInLocalStorage === null) {
    originIsInLocalStorage = !!localStorage.getItem(DopplerOriginLocalStorageKey);
  }

  if (!originIsInLocalStorage) {
    localStorage.setItem(DopplerOriginLocalStorageKey, originFromUrl as string);
    localStorage.setItem(DopplerOriginDateLocalStorageKey, new Date().toUTCString());
    originIsInLocalStorage = true;
  }

  return output;
}

export const OriginCatcher = withRouter(InjectAppServices(_OriginCatcher));
