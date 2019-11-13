import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';

const getDefaultBannerData = (intl) => {
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

/**
 * Promotions
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const Promotions = function({ type, page, dependencies: { dopplerSitesClient } }) {
  const intl = useIntl();
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const bannerData = await dopplerSitesClient.getBannerData(intl.locale, type, page || '');
      if (!bannerData.success) {
        setState({ loading: false, bannerData: getDefaultBannerData(intl) });
      } else {
        setState({ loading: false, bannerData: bannerData.value });
      }
    };

    fetchData();
  }, [dopplerSitesClient, page, intl, type]);

  return (
    <section className="feature-panel" style={{ position: 'relative' }}>
      {state.loading ? (
        <Loading />
      ) : (
        <div
          className="feature-panel--bg"
          style={{
            backgroundImage: `url(${state.bannerData.backgroundUrl})`,
            color: state.bannerData.fontColor,
          }}
        >
          <article className="feature-content">
            <h6>{state.bannerData.functionality}</h6>
            <h1>{state.bannerData.title}</h1>
            <p>{state.bannerData.description}</p>
          </article>
          <figure className="content-img">
            <img src={state.bannerData.imageUrl} alt="" />
          </figure>
        </div>
      )}
    </section>
  );
};

export default InjectAppServices(Promotions);
