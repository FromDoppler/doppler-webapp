import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import Loading from '../../Loading/Loading';

/**
 * Promotions
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const Promotions = function({ intl, type, page, dependencies: { dopplerSitesClient } }) {
  const [bannerData, setBannerData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const bannerData = await dopplerSitesClient.getBannerData(intl.locale, type, page || '');
      setBannerData(bannerData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <section className="feature-panel" style={{ position: 'relative' }}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="feature-panel--bg" style={{ backgroundImage: `url(${bannerData.backgroundUrl})` }}>
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
