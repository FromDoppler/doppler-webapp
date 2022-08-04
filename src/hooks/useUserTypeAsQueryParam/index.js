import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const ACCOUNT_TYPE = 'accountType';
export const PAID_ACCOUNT = 'PAID';
export const FREE_ACCOUNT = 'FREE';

export const useUserTypeAsQueryParam = (isFreeAccount) => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(history.location.search);
    const currentAccountType = getAccountType(isFreeAccount);

    if (!params.has(ACCOUNT_TYPE)) {
      params.append(ACCOUNT_TYPE, currentAccountType);
      history.push({ search: params.toString() });
    } else if (params.get(ACCOUNT_TYPE) !== currentAccountType) {
      params.set(ACCOUNT_TYPE, currentAccountType);
      history.push({ search: params.toString() });
    }
  }, [history, location, isFreeAccount]);

  return null;
};

export const getAccountType = (isFreeAccount) => (isFreeAccount ? FREE_ACCOUNT : PAID_ACCOUNT);
