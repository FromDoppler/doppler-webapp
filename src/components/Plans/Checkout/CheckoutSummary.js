import React from 'react';
import SafeRedirect from '../../SafeRedirect';
import { useLinkedinInsightTag } from '../../../hooks/useLinkedingInsightTag';
import { useQueryParams } from '../../../hooks/useQueryParams';

export const CheckoutSummary = () => {
  useLinkedinInsightTag();

  const query = useQueryParams();
  const redirect = query.get('redirect');
  const legacy = query.get('legacy');

  if (legacy) {
    if (redirect) {
      return <SafeRedirect to={redirect} />;
    }
    return <SafeRedirect to="/Campaigns/Draft" />;
  }

  return 'Normal checkout flow for new plans should go here.';
};
