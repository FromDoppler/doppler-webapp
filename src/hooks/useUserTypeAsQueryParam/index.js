import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const ACCOUNT_TYPE = 'accountType';
export const PAID_ACCOUNT = 'PAID';
export const FREE_ACCOUNT = 'FREE';

export const useUserTypeAsQueryParam = (isFreeAccount) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentAccountType = getAccountType(isFreeAccount);

    if (!params.has(ACCOUNT_TYPE)) {
      params.append(ACCOUNT_TYPE, currentAccountType);
      navigate({ search: params.toString() });
    } else if (params.get(ACCOUNT_TYPE) !== currentAccountType) {
      params.set(ACCOUNT_TYPE, currentAccountType);
      navigate({ search: params.toString() });
    }
  }, [navigate, location, isFreeAccount]);

  return null;
};

export const getAccountType = (isFreeAccount) => (isFreeAccount ? FREE_ACCOUNT : PAID_ACCOUNT);
