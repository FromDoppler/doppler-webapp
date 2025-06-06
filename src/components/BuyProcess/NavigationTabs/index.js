import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../doppler-types';
import { FieldGroup, FieldItemAccessible } from '../../form-helpers/form-helpers';
import { RadioBox, RadioInfo } from '../RadioBox';

const RadioFooter = ({ text }) => <div className="dp-footer--radio">{text}</div>;

export const NavigationTabs = ({
  planTypes,
  selectedPlanType,
  searchQueryParams,
  currentPlanType,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const hasSelectedPlanType = planTypes.filter((pt) => pt.type === selectedPlanType).length > 0;

  if (
    currentPlanType !== selectedPlanType &&
    !hasSelectedPlanType &&
    currentPlanType !== PLAN_TYPE.free
  ) {
    window.location.href = `/plan-selection/premium/${URL_PLAN_TYPE[currentPlanType]}${searchQueryParams}`;
  }

  const getTypePlanDescriptionWithTooltip = (planType) =>
    _(`buy_process.plan_selection.plan_type_${planType.replace('-', '_')}_label`);

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
              to={`/plan-selection/premium/${URL_PLAN_TYPE[planType.type]}${searchQueryParams}`}
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
                        id={
                          planType.type === PLAN_TYPE.byCredit
                            ? `buy_process.min_single_plan_price`
                            : `buy_process.min_monthly_plan_price`
                        }
                        values={{
                          P: (chunk) => <p>{chunk}</p>,
                          Strong: (chunk) => <strong>{chunk}</strong>,
                          price: planType.minPrice,
                        }}
                      />
                    }
                  />
                }
                info={<RadioInfo info={_(planType.info)} />}
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
