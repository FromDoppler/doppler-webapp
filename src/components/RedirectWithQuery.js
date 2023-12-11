import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function parse(path) {
  const parsed = /^([^?]*)(\?(.+))?$/.exec(path);
  const pathname = parsed[1];
  const search = parsed[3];
  return { pathname, search };
}

const RedirectWithQuery = ({ to }) => {
  const { search } = useLocation();

  // TODO: it is loosing state and others location parameters
  const parsedTo = parse(to);
  const parsedCurrent = parse(search);
  const newSearch =
    parsedTo.search && parsedCurrent.search
      ? '?' + parsedTo.search + '&' + parsedCurrent.search
      : parsedTo.search
        ? '?' + parsedTo.search
        : parsedCurrent.search
          ? '?' + parsedCurrent.search
          : '';

  return (
    <Navigate
      to={{
        pathname: parsedTo.pathname,
        search: newSearch,
      }}
    />
  );
};

export default RedirectWithQuery;
