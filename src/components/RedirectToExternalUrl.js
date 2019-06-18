import React, { useLayoutEffect } from 'react';
import { InjectAppServices } from '../services/pure-di';

/**
 * @param { Object } props
 * @param { string } props.to
 * @param { import('../services/pure-di').AppServices } props.dependencies
 */
function RedirectToExternalUrl({
  to,
  dependencies: {
    window: { location },
  },
}) {
  useLayoutEffect(() => {
    location.href = to;
  }, [to, location]);
  return <></>;
}

export default InjectAppServices(RedirectToExternalUrl);
