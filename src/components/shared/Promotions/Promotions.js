import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import Loading from '../../Loading/Loading';

const getDefaultBannerData = (intl) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return {
    title: _('default_banner_data.title'),
    description: _('default_banner_data.description'),
    backgroundUrl: _('default_banner_data.background_url'),
    imageUrl: _('default_banner_data.image_url'),
    functionality: _('default_banner_data.functionality'),
    fontColor: '#000',
  };
};

/**
 * Promotions
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const Promotions = function({
  intl,
  type,
  page,
  disabledSitesContent,
  dependencies: { dopplerSitesClient },
}) {
  const [bannerData, setBannerData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (disabledSitesContent) {
      setBannerData(getDefaultBannerData(intl));
      setIsLoading(false);
    } else {
      const fetchData = async () => {
        setIsLoading(true);
        const bannerData = await dopplerSitesClient.getBannerData(intl.locale, type, page || '');
        setBannerData(
          bannerData.success && bannerData.value ? bannerData.value : getDefaultBannerData(intl),
        );
        setIsLoading(false);
      };

      fetchData();
    }
  }, [disabledSitesContent, dopplerSitesClient, page, intl, type]);

  return (
    <section className="feature-panel" style={{ position: 'relative' }}>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className="feature-panel--bg"
          style={{
            backgroundImage: `url(${bannerData.backgroundUrl})`,
            color: bannerData.fontColor,
          }}
        >
          <article className="feature-content">
            <h6>{bannerData.functionality}</h6>
            <h1>{bannerData.title}</h1>
            <p>{bannerData.description}</p>
          </article>
          <figure className="content-img">
            <img src={bannerData.imageUrl} alt="" />
          </figure>
        </div>
      )}
    </section>
  );
};

export default InjectAppServices(injectIntl(Promotions));
