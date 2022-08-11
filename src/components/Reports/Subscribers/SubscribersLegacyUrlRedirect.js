import React from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import SafeRedirect from '../../SafeRedirect';
import { replaceSpaceWithSigns, extractParameter } from '../../../utils';
import queryString from 'query-string';

const SubscribersLegacyUrlRedirect = () => {
  const location = useLocation();
  const { section } = useParams();
  const email = replaceSpaceWithSigns(extractParameter(location, queryString.parse, 'email'));

  if ((section !== 'gdpr' && section !== 'history') || !email) {
    return <SafeRedirect to="/Lists/MasterSubscriber/" />;
  }

  return <Navigate to={`/subscribers/${email}/${section}`} />;
};

export default InjectAppServices(SubscribersLegacyUrlRedirect);
