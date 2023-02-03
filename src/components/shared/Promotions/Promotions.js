import React from 'react';
import { Loading } from '../../Loading/Loading';

/**
 * Promotions
 * @param { Object } props
 */
const Promotions = function ({ loading, bannerData }) {
  return (
    <section className="feature-panel" style={{ position: 'relative' }}>
      {loading ? (
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
            <div dangerouslySetInnerHTML={{ __html: bannerData.description }} />
          </article>
          <figure className="content-img">
            <img src={bannerData.imageUrl} alt="" />
          </figure>
        </div>
      )}
    </section>
  );
};

export default Promotions;
