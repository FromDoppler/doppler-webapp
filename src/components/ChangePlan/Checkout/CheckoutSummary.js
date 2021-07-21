import React from 'react';
import { extractParameter } from '../../../utils';
import queryString from 'query-string';
import SafeRedirect from '../../SafeRedirect';

export const CheckoutSummary = ({ location }) => {
  const redirect = extractParameter(location, queryString.parse, 'redirect');
  const legacy = extractParameter(location, queryString.parse, 'legacy');

  if (legacy) {
    if (redirect) {
      return <SafeRedirect to={redirect} />;
    }
    return <SafeRedirect to="/Campaigns/Draft" />;
  }

  return 'Normal checkout flow for new plans should go here.';
};
