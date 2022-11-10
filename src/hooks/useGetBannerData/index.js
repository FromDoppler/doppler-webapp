import { useEffect, useReducer, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useQueryParams } from '../useQueryParams';
import {
  bannerDataReducer,
  BANNER_DATA_ACTIONS,
  INITIAL_STATE_BANNER_DATA,
} from './bannerDataReducer';

export const getDefaultBannerData = (intl) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return {
    title: _('default_banner_data.title'),
    description: _('default_banner_data.description'),
    backgroundUrl: _('default_banner_data.background_url'),
    imageUrl: _('default_banner_data.image_url'),
    functionality: _('default_banner_data.functionality'),
    fontColor: '#FFF',
  };
};

export const useGetBannerData = ({ dopplerSitesClient, type, page }) => {
  const intl = useIntl();
  const query = useQueryParams();
  const executedRef = useRef(false);
  const [state, dispatch] = useReducer(bannerDataReducer, INITIAL_STATE_BANNER_DATA);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: BANNER_DATA_ACTIONS.START_FETCH });
      const bannerData = await dopplerSitesClient.getBannerData(intl.locale, type, page ?? '');
      dispatch({
        type: BANNER_DATA_ACTIONS.FINISH_FETCH,
        payload: !bannerData || !bannerData.success ? getDefaultBannerData(intl) : bannerData.value,
      });
    };

    if (!executedRef.current && (!query.get('lang') || query.get('lang') === intl.locale)) {
      executedRef.current = true;
      fetchData();
    }
  }, [dopplerSitesClient, intl, executedRef, page, type, query]);

  return state;
};
