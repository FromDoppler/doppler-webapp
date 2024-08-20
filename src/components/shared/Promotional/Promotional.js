import React from 'react';
import PropTypes from 'prop-types';
import { StyledPromotionalLogo, StyledPromotionalPreviewImg } from './Promotional.styles';

export const Promotional = ({
  title,
  description,
  features,
  paragraph,
  actionText,
  actionUrl,
  actionFunc,
  logoUrl,
  previewUrl,
  caption,
}) => {
  return (
    <section className="p-t-54 p-b-54">
      <div className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12">
            <div className="dp-icon-promotion">
              <StyledPromotionalLogo src={logoUrl} alt="icon" />
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="dp-content-promotion">
              <h1>{title}</h1>
              {React.isValidElement(description) ? description : <p>{description}</p>}

              {features ? (
                <ul className="dp-list-promo">
                  {features.map((feature, index) => (
                    <li key={index}>
                      {React.isValidElement(feature) ? feature : <p>{feature}</p>}
                    </li>
                  ))}
                </ul>
              ) : null}

              {paragraph ? <span className="dp-cta-paragraph">{paragraph}</span> : null}

              <div className="dp-actions">
                {actionFunc ? (
                  <button className="dp-button button-big primary-green" onClick={actionFunc()}>
                    {actionText}
                  </button>
                ) : (
                  <a href={actionUrl} className="dp-button button-big primary-green">
                    {actionText}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <figure className="dp-img-promotion">
              <StyledPromotionalPreviewImg src={previewUrl} alt={title} />
              {caption ? <figcaption>{caption}</figcaption> : null}
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
Promotional.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  features: PropTypes.array,
  paragraph: PropTypes.string,
  actionText: PropTypes.string.isRequired,
  actionUrl: PropTypes.string.isRequired,
  actionFunc: PropTypes.func,
  logoUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  previewUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  caption: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
