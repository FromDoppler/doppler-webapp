import PropTypes from 'prop-types';
import { numberFormatOptions } from '../../../../doppler-types';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { thousandSeparatorNumber } from '../../../../utils';

export const SelectedOnSitePlan = ({ selectedPlan, item, addItem, removeItem }) => {
  const intl = useIntl();
  if (selectedPlan) {
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { fee, printQty } = selectedPlan;

    return (
      <div className="dp-boxgrey">
        <div className="dp-price">
          <h2>
            US$ <FormattedNumber value={selectedPlan?.planId ? fee : 0} {...numberFormatOptions} />
            */{_('onsite_selection.selected_onsite_plan.month_message')}
          </h2>
        </div>
        <h3>{_('onsite_selection.selected_onsite_plan.prints_plan_message')}</h3>
        {selectedPlan?.planId ? (
          <ul className="dp-items-plan">
            <li>
              <div className="dp-icon-lock">
                <span className="dp-ico--ok"></span>{' '}
                <span>
                  <FormattedMessage
                    id={`onsite_selection.selected_onsite_plan.includes_until_prints_message`}
                    values={{
                      prints: `${thousandSeparatorNumber(intl.defaultLocale, printQty)}${' '}`,
                    }}
                  />
                </span>
              </div>
            </li>
          </ul>
        ) : (
          <p>{_('onsite_selection.selected_onsite_plan.no_onsite_plan_selected_message')}</p>
        )}

        <hr className="dp-h-divider m-t-12 m-b-12" />
        <button
          type="button"
          className="dp-button button-medium ctaTertiary"
          disabled={!selectedPlan?.planId}
          onClick={!item ? () => addItem(selectedPlan) : removeItem}
        >
          <span>
            {item
              ? `${_('onsite_selection.selected_onsite_plan.remove_from_cart_button')}`
              : `${_('onsite_selection.selected_onsite_plan.add_to_cart_button')}`}
          </span>
        </button>
      </div>
    );
  }

  return null;
};

SelectedOnSitePlan.propTypes = {
  selectedPlan: PropTypes.shape({
    fee: PropTypes.number,
    printQty: PropTypes.number,
  }),
  item: PropTypes.shape({
    fee: PropTypes.number.isRequired,
    printQty: PropTypes.number.isRequired,
  }),
  addItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};
