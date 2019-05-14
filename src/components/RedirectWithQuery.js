import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function parse(path) {
  const parsed = /^([^?]*)(\?(.+))?$/.exec(path);
  const pathname = parsed[1];
  const search = parsed[3];
  return { pathname, search };
}

const RedirectWithQuery = ({ exact, from, to }) => (
  <Route
    exact={exact}
    path={from}
    component={({ location: { search } }) => {
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
        <Redirect
          to={{
            pathname: parsedTo.pathname,
            search: newSearch,
          }}
        />
      );
    }}
  />
);

export default RedirectWithQuery;
