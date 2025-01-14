import PropTypes from 'prop-types';
import { numberFormatOptions } from '../../../../doppler-types';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { thousandSeparatorNumber } from '../../../../utils';

export const SelectedOnSitePlan = ({ selectedPlan, customPlan, item, addItem, removeItem }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="dp-boxgrey">
      <div className="dp-price">
        <h2>
          {selectedPlan ? '' : _('onsite_selection.selected_onsite_plan.from')}
          US${' '}
          <FormattedNumber
            value={selectedPlan ? (selectedPlan?.planId ? selectedPlan?.fee : 0) : customPlan.fee}
            {...numberFormatOptions}
          />
          */{_('onsite_selection.selected_onsite_plan.month_message')}
        </h2>
      </div>
      <h3>{_('onsite_selection.selected_onsite_plan.prints_plan_message')}</h3>
      {selectedPlan !== undefined && selectedPlan.printQty === 0 ? (
        <p>{_('onsite_selection.selected_onsite_plan.no_onsite_plan_selected_message')}</p>
      ) : (
        <ul className="dp-items-plan">
          <li>
            <div className="dp-icon-lock">
              <span className="dp-ico--ok"></span>{' '}
              <span>
                <FormattedMessage
                  id={`${
                    selectedPlan
                      ? 'onsite_selection.selected_onsite_plan.includes_until_prints_message'
                      : 'onsite_selection.selected_onsite_plan.custom_includes_until_prints_message'
                  }`}
                  values={{
                    prints: `${thousandSeparatorNumber(
                      intl.defaultLocale,
                      selectedPlan ? selectedPlan?.printQty : customPlan.printQty,
                    )}${' '}`,
                  }}
                />
              </span>
            </div>
          </li>
          <li>
            <div className="dp-icon-lock">
              <span className="dp-ico--ok"></span>{' '}
              <span>
                <FormattedMessage
                  id={`${
                    selectedPlan
                      ? 'onsite_selection.selected_onsite_plan.cost_print_message'
                      : 'onsite_selection.selected_onsite_plan.custom_cost_print_message'
                  }`}
                  values={{
                    bold: (chunks) => <b>{chunks}</b>,
                    costPrint: `${(selectedPlan
                      ? (selectedPlan?.planId ? selectedPlan?.fee : 0) / selectedPlan?.printQty
                      : (customPlan?.planId ? customPlan?.fee : 0) / customPlan?.printQty
                    ).toFixed(4)}${' '}`,
                  }}
                />
              </span>
            </div>
          </li>
          <li>
            <div className="dp-icon-lock">
              <span className="dp-ico--ok"></span>{' '}
              <span>
                <FormattedMessage
                  id={`${
                    selectedPlan
                      ? 'onsite_selection.selected_onsite_plan.additional_print_message'
                      : 'onsite_selection.selected_onsite_plan.custom_additional_print_message'
                  }`}
                  values={{
                    bold: (chunks) => <b>{chunks}</b>,
                    additionalPrint: `${(selectedPlan
                      ? selectedPlan?.additionalPrint
                      : customPlan?.additionalPrint
                    ).toFixed(4)}${' '}`,
                  }}
                />
              </span>
            </div>
          </li>
        </ul>
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
