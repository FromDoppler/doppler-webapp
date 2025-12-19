import React from 'react';
import { Navigate } from 'react-router-dom';
import queryString from 'query-string';

const PARAMS_TO_PRESERVE = ['page'];

/**
 * Extracts specified parameters from search string in a case-insensitive manner.
 * @param { string } search - The query string (e.g., "?page=xxx&lang=en")
 * @param { string[] } paramsToExtract - Array of parameter names to extract
 */
function extractPreservedParams(search, paramsToExtract) {
  const searchParams = queryString.parse(search);
  const preservedParams = {};

  paramsToExtract.forEach((paramName) => {
    const foundKey = Object.keys(searchParams).find(
      (key) => key.toLowerCase() === paramName.toLowerCase(),
    );

    if (foundKey && searchParams[foundKey]) {
      preservedParams[paramName.toLowerCase()] = searchParams[foundKey];
    }
  });

  return preservedParams;
}

/**
 * @param { Object } props
 * @param { Object } props.from
 * @param { string } props.from.pathname
 * @param { string } props.from.search;
 * @param { string } props.from.hash;
 */
export default function RedirectToLogin({ from }) {
  const preservedParams = extractPreservedParams(from.search, PARAMS_TO_PRESERVE);

  const queryStringPart = queryString.stringify(preservedParams);
  const loginPath = queryStringPart ? `/login?${queryStringPart}` : '/login';

  return <Navigate to={loginPath} state={{ from }} />;
}
