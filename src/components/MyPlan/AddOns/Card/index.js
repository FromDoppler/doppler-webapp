import { useIntl } from 'react-intl';
import * as S from './index.styles';

export const Card = ({
  title,
  icon,
  description,
  priceSection,
  moreInformationText,
  moreInformationLink,
  buyButtonText,
  buyButtonUrl,
  isNewFeature,
  isBeta,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="dp-box-shadow m-b-24">
      <section className="dp-addons-wrapper">
        {isNewFeature && (
          <div class="dp-ribbon dp-ribbon-top-right dp-ribbon-violet">
            <S.Text>{_(`my_plan.addons.new_feature_label`)}</S.Text>
          </div>
        )}
        <header>
          <div className="dp-rowflex p-l-12">
            <h3 className="dp-second-order-title">
              {title}
              <span className={`p-l-6 dpicon ${icon}`}></span>
            </h3>
            {isBeta && <S.Badge>{_(`my_plan.addons.beta_label`)}</S.Badge>}
          </div>
        </header>
        <article className="dp-container">
          <div className="dp-rowflex dp-content-addons">
            <div className="col-sm-6">
              <p className="dp-description-legend m-r-6">{description}</p>
            </div>
            {priceSection}
          </div>
        </article>
        <hr></hr>
        <footer className="dp-footer-addons">
          {moreInformationLink !== '' ? (
            <a href={moreInformationLink} className="dp-more-information" target="_blanck">
              {moreInformationText}
            </a>
          ) : (
            <div></div>
          )}
          {isBeta ? (
            <button type="button" disabled={true} className="dp-button button-medium primary-green">
              {buyButtonText}
            </button>
          ) : (
            <a href={buyButtonUrl} aria-disabled={true}>
              <button type="button" className="dp-button button-medium primary-green">
                {buyButtonText}
              </button>
            </a>
          )}
        </footer>
      </section>
    </div>
  );
};
