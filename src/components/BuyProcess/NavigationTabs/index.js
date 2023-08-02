import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { URL_PLAN_TYPE } from '../../../doppler-types';
import { FieldGroup, FieldItemAccessible } from '../../form-helpers/form-helpers';
import { RadioBox } from '../RadioBox';

const NavigationTabs = ({ planTypes, selectedPlanType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const location = useLocation();

  const getTypePlanDescriptionWithTooltip = (planType) =>
    _(`plan_calculator.plan_type_${planType.replace('-', '_')}`);

  return (
    <nav>
      <FieldGroup aria-label="navigator tabs">
        {planTypes.map((planType) => (
          <FieldItemAccessible
            data-testid="tab-item--plan-calculator"
            className="col-md-4 m-b-12"
            key={planType.type}
          >
            <Link
              to={`/plan-selection/premium/${URL_PLAN_TYPE[planType.type]}${location.search}`}
              className={planType.type === selectedPlanType ? 'tab--link active' : 'tab--link'}
            >
              <RadioBox
                value={planType.type}
                label={getTypePlanDescriptionWithTooltip(planType.type)}
                checked={planType.type === selectedPlanType}
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
      minPrice: PropTypes.number,
    }),
  ).isRequired,
  selectedPlanType: PropTypes.string.isRequired,
};

export default NavigationTabs;
