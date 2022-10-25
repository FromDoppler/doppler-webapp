import { useEffect, useReducer, useRef } from 'react';
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

export const useGetBannerData = ({ dopplerSitesClient, intl, type, page }) => {
  const intlRef = useRef(intl);
  const [state, dispatch] = useReducer(bannerDataReducer, INITIAL_STATE_BANNER_DATA);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: BANNER_DATA_ACTIONS.START_FETCH });
      const bannerData = await dopplerSitesClient.getBannerData(
        intlRef.current.locale,
        type,
        page ?? '',
      );
      dispatch({
        type: BANNER_DATA_ACTIONS.FINISH_FETCH,
        payload:
          !bannerData || !bannerData.success
            ? getDefaultBannerData(intlRef.current)
            : bannerData.value,
      });
    };

    fetchData();
  }, [dopplerSitesClient, intlRef, page, type]);

  return state;
};
