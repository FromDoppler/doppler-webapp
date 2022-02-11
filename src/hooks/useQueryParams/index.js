import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useQueryParams = () => {
  const location = useLocation().search;
  return useMemo(() => new URLSearchParams(location), [location]);
};
