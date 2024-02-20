import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PLAN_TYPE } from '../../../../doppler-types';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Link as ScrollLink } from 'react-scroll';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const PlanTypeCard = ({
  planType,
  pathname,
  planName,
  description,
  comment,
  ribbonText,
  features,
  minPrice,
  minPriceWithDiscount,
  isArgentina,
  discountPercentage,
  scrollTo,
  disabled = false,
  queryParams,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <div className={`dp-card-with-border ${disabled ? 'dp-card-disabled' : ''}`}>
      {ribbonText && (
        <div role="alert" className="dp-ribbon dp-ribbon-top-right dp-ribbon-orange">
          <span>{ribbonText}</span>
        </div>
      )}
      <div className="dp-content-plans">
        <h3>{planName}</h3>
        <p className="dp-ta-left">{description}</p>
        <p className="dp-ta-left">
          <strong>{comment}</strong>
        </p>
      </div>
      <div className="dp-price">
        {planType === PLAN_TYPE.free ? (
          <button type="button" className="dp-button button-medium ctaTertiary" disabled>
            {_('plan_types.actual_plan')}
          </button>
        ) : (
          <>
            <FormattedMessage
              id={
                planType === PLAN_TYPE.byCredit
                  ? 'plan_types.min_single_plan_price'
                  : 'plan_types.min_monthly_plan_price'
              }
              values={{
                Span: (chunk) => <span> {chunk}</span>,
                SpanStrike: (chunk) =>
                  isArgentina && minPriceWithDiscount ? (
                    <span className="dp-discount-price-arg">{chunk}</span>
                  ) : (
                    ''
                  ),
                H3: (chunk) => <h3>{chunk}</h3>,
                price: (
                  <FormattedNumber
                    value={isArgentina && minPriceWithDiscount ? minPriceWithDiscount : minPrice}
                    {...numberFormatOptions}
                  />
                ),
                priceStrike:
                  isArgentina && minPriceWithDiscount ? (
                    <FormattedNumber value={minPrice} {...numberFormatOptions} />
                  ) : (
                    ''
                  ),
              }}
            />
            <Link
              to={`${pathname}?${queryParams}`}
              className="dp-button button-medium primary-green dp-uppercase"
            >
              {_('plan_types.calculate_value_button_label')}
            </Link>
            {isArgentina && minPriceWithDiscount && (
              <span className="dp-off">
                <strong>{discountPercentage}% OFF</strong>{' '}
                {_('plan_types.discount_argentina_label')}
              </span>
            )}
          </>
        )}
      </div>
      <hr className="dp-border" />
      <div className="dp-whatcan">
        <h4>{_('plan_types.functionalities_label')}</h4>
        {features?.map((item, index) => (
          <li key={`fi-${index}`}>{item}</li>
        ))}
        {scrollTo && (
          <ScrollLink smooth={true} offset={-50} duration={500} to={scrollTo} href={`#${scrollTo}`}>
            {_('plan_types.see_all_features_label')}
          </ScrollLink>
        )}
      </div>
    </div>
  );
};

PlanTypeCard.propTypes = {
  planType: PropTypes.oneOf([
    PLAN_TYPE.free,
    PLAN_TYPE.byContact,
    PLAN_TYPE.byEmail,
    PLAN_TYPE.byCredit,
  ]).isRequired,
  pathname: PropTypes.string,
  planName: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  comment: PropTypes.node,
  ribbonText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  features: PropTypes.arrayOf(PropTypes.node).isRequired,
  minPrice: PropTypes.number,
  scrollTo: PropTypes.string,
  disabled: PropTypes.bool,
};
