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
            key={planType}
          >
            <Link
              to={`/plan-selection/premium/${URL_PLAN_TYPE[planType]}${location.search}`}
              className={planType === selectedPlanType ? 'tab--link active' : 'tab--link'}
            >
              <RadioBox
                value={planType}
                label={getTypePlanDescriptionWithTooltip(planType)}
                checked={planType === selectedPlanType}
                handleClick={null}
              />
            </Link>
          </FieldItemAccessible>
        ))}
      </FieldGroup>
    </nav>
  );
};

export default NavigationTabs;
