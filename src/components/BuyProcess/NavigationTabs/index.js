import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { URL_PLAN_TYPE } from '../../../doppler-types';
import { FieldGroup, FieldItemAccessible } from '../../form-helpers/form-helpers';
import { RadioBox, RadioInfo } from '../RadioBox';

const RadioFooter = ({ text }) => <div className="dp-footer--radio">{text}</div>;

export const NavigationTabs = ({ planTypes, selectedPlanType, searchQueryParams }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getTypePlanDescriptionWithTooltip = (planType) =>
    _(`plan_calculator.plan_type_${planType.replace('-', '_')}`);

  return (
    <nav>
      <FieldGroup aria-label="navigator tabs">
        {planTypes.map((planType) => (
          <FieldItemAccessible
            data-testid="tab-item--plan-calculator"
            className="col-md-4 m-b-12 p-l-0"
            key={planType.type}
          >
            <Link
              to={`/buy-process/primer-pantalla/${
                URL_PLAN_TYPE[planType.type]
              }${searchQueryParams}`}
            >
              <RadioBox
                value={planType.type}
                label={getTypePlanDescriptionWithTooltip(planType.type)}
                checked={planType.type === selectedPlanType}
                disabled={planType.disabled}
                footer={
                  <RadioFooter
                    text={
                      <FormattedMessage
                        id={`buy_process.min_monthly_plan_price`}
                        values={{
                          P: (chunk) => <p>{chunk}</p>,
                          Strong: (chunk) => <strong>{chunk}</strong>,
                          price: planType.minPrice,
                        }}
                      />
                    }
                  />
                }
                info={<RadioInfo info={planType.info} />}
                handleClick={null}
              />
            </Link>
          </FieldItemAccessible>
        ))}
      </FieldGroup>
    </nav>
  );
};

NavigationTabs.propTypes = {
  planTypes: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      minPrice: PropTypes.number.isRequired,
      info: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    }),
  ).isRequired,
  selectedPlanType: PropTypes.string.isRequired,
  searchQueryParams: PropTypes.string,
};
