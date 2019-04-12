import React from 'react';
import { Redirect } from 'react-router-dom';

/**
 * @param { Object } props
 * @param { Object } props.from
 * @param { string } props.from.pathname
 * @param { string } props.from.search;
 * @param { string } props.from.hash;
 */
export default function RedirectToLogin({ from }) {
  return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: from },
      }}
    />
  );
}
