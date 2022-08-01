import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const ACCOUNT_TYPE = 'accountType';
export const PAID_ACCOUNT = 'PAID';
export const FREE_ACCOUNT = 'FREE';

export const useUserTypeAsQueryParam = (isFreeAccount) => {
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(history.location.search);
    if (!params.has(ACCOUNT_TYPE)) {
      params.append(ACCOUNT_TYPE, getAccountType(isFreeAccount));
      history.push({ search: params.toString() });
    }
  }, [history, isFreeAccount]);

  return null;
};

export const getAccountType = (isFreeAccount) => (isFreeAccount ? FREE_ACCOUNT : PAID_ACCOUNT);
