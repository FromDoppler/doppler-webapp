import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyledPromotionalLogo, StyledPromotionalPreviewImg } from './Promotional.styles';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';

export const Promotional = ({
  title,
  description,
  features,
  paragraph,
  paragraph_MD,
  actionText,
  actionUrl,
  actionFunc,
  logoUrl,
  previewUrl,
  caption,
  errorMessage,
}) => {
  const [buttonClicked, setbuttonClicked] = useState(false);

  const handleButtonClick = (actionFunc) => {
    setbuttonClicked(true);
    actionFunc();
  };

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
              {React.isValidElement(paragraph_MD) ? paragraph_MD : <span>{paragraph_MD}</span>}
              {errorMessage ? (
                <div className="dp-wrap-message dp-wrap-cancel">
                  <span className="dp-message-icon"></span>
                  <div className="dp-content-message">
                    <FormattedMessageMarkdown id={errorMessage} linkTarget={'_blank'} />
                  </div>
                </div>
              ) : null}
              <div className="dp-actions">
                {actionFunc ? (
                  <button
                    className={`dp-button button-big primary-green ${
                      buttonClicked && !errorMessage ? 'button--loading' : ''
                    } `}
                    disabled={buttonClicked}
                    onClick={() => handleButtonClick(actionFunc())}
                  >
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
  paragraph_MD: PropTypes.string,
  actionText: PropTypes.string.isRequired,
  actionUrl: PropTypes.string.isRequired,
  actionFunc: PropTypes.func,
  logoUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  previewUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  caption: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  errorMessage: PropTypes.string,
};
