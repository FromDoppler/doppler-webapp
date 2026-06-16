import PropTypes from 'prop-types';
import { HeaderStyled } from '../index.style';

export const AddOnPlanCard = ({
  title,
  iconClassName,
  description,
  actions,
  showPromotionInformation,
  promotionInformation,
  promotionClassName = 'm-t-12',
  children,
}) => {
  return (
    <div className="dp-box-shadow m-b-24">
      <article className="dp-wrapper-plan">
        <header>
          <HeaderStyled className="dp-rowflex">
            <div className="col-lg-9 col-md-12">
              <div className="dp-title-plan">
                <h3 className="dp-second-order-title">
                  <span className="p-r-8 m-r-6">{title}</span>
                  <span className={iconClassName} />
                </h3>
                {description}
              </div>
            </div>
            <div className="col-lg-3 col-md-12">
              <div className="dp-buttons--plan">{actions}</div>
            </div>
          </HeaderStyled>
        </header>
        {showPromotionInformation && (
          <div className={`dp-wrap-message dp-wrap-info ${promotionClassName}`}>
            <span className="dp-message-icon" />
            <div className="dp-content-message dp-content-full">
              <p>{promotionInformation}</p>
            </div>
          </div>
        )}
        {children}
      </article>
    </div>
  );
};

AddOnPlanCard.propTypes = {
  title: PropTypes.node.isRequired,
  iconClassName: PropTypes.string.isRequired,
  description: PropTypes.node,
  actions: PropTypes.node.isRequired,
  showPromotionInformation: PropTypes.bool,
  promotionInformation: PropTypes.node,
  promotionClassName: PropTypes.string,
  children: PropTypes.node,
};
