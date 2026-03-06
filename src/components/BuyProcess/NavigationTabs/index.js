import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../doppler-types';
import { FieldGroup, FieldItemAccessible } from '../../form-helpers/form-helpers';
import { RadioBox, RadioInfo } from '../RadioBox';

export const NavigationTabs = ({
  planTypes,
  selectedPlanType,
  searchQueryParams,
  currentPlanType,
  isFreeAccount = false,
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
    <nav className="dp-plan-selection-tabs">
      <FieldGroup aria-label="navigator tabs">
        {planTypes.map((planType) => {
          const isContacts = planType.type === PLAN_TYPE.byContact;
          const showContactsHardcodedPrice = isContacts && isFreeAccount;

          const footerMessageId = showContactsHardcodedPrice
            ? 'buy_process.min_monthly_plan_price_contacts_hardcoded'
            : planType.type === PLAN_TYPE.byCredit
              ? 'buy_process.min_single_plan_price'
              : 'buy_process.min_monthly_plan_price';

          const footerValues = showContactsHardcodedPrice
            ? {
                P: (chunk) => <p>{chunk}</p>,
                Strong: (chunk) => <strong>{chunk}</strong>,
                Strike: (chunk) => <del className="dp-discount-price-contact">{chunk}</del>,
                Discount: (chunk) => <p className="dp-off dp-off-promocode">{chunk}</p>,
              }
            : {
                P: (chunk) => <p>{chunk}</p>,
                Strong: (chunk) => <strong>{chunk}</strong>,
                price: planType.minPrice,
              };

          return (
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
                    <div
                      className={`dp-footer--radio ${showContactsHardcodedPrice ? 'dp-footer--radio--contacts-hardcoded' : ''}`}
                    >
                      <FormattedMessage id={footerMessageId} values={footerValues} />
                    </div>
                  }
                  info={<RadioInfo info={_(planType.info)} />}
                  handleClick={null}
                />
              </Link>
            </FieldItemAccessible>
          );
        })}
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
  isFreeAccount: PropTypes.bool,
};
