import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * @param { Object } props
 * @param { Object } props.from
 * @param { string } props.from.pathname
 * @param { string } props.from.search;
 * @param { string } props.from.hash;
 */
export default function RedirectToLogin({ from }) {
  return <Navigate to="/login" state={{ from }} />;
}
