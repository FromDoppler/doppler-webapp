import PropTypes from 'prop-types';
import { numberFormatOptions } from '../../../../doppler-types';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { thousandSeparatorNumber } from '../../../../utils';

export const SelectedPushNotificationPlan = ({
  selectedPlan,
  customPlan,
  item,
  addItem,
  removeItem,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="dp-boxgrey">
      <div className="dp-price">
        <h2>
          {selectedPlan
            ? ''
            : _('push_notification_selection.selected_push_notification_plan.from')}
          US${' '}
          <FormattedNumber
            value={selectedPlan ? (selectedPlan?.planId ? selectedPlan?.fee : 0) : customPlan.fee}
            {...numberFormatOptions}
          />
          */{_('push_notification_selection.selected_push_notification_plan.month_message')}
        </h2>
      </div>
      <h3>
        {_('push_notification_selection.selected_push_notification_plan.emails_plan_message')}
      </h3>
      {selectedPlan !== undefined && selectedPlan.quantity === 0 ? (
        <p>
          {_(
            'push_notification_selection.selected_push_notification_plan.no_push_notification_plan_selected_message',
          )}
        </p>
      ) : (
        <ul className="dp-items-plan">
          <li>
            <div className="dp-icon-lock">
              <span className="dp-ico--ok"></span>{' '}
              <span>
                <FormattedMessage
                  id={`${
                    selectedPlan
                      ? 'push_notification_selection.selected_push_notification_plan.includes_until_emails_message'
                      : 'push_notification_selection.selected_push_notification_plan.custom_includes_until_emails_message'
                  }`}
                  values={{
                    emails: `${thousandSeparatorNumber(
                      intl.defaultLocale,
                      selectedPlan ? selectedPlan?.quantity : customPlan.quantity,
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
                      ? 'push_notification_selection.selected_push_notification_plan.cost_email_message'
                      : 'push_notification_selection.selected_push_notification_plan.custom_cost_email_message'
                  }`}
                  values={{
                    bold: (chunks) => <b>{chunks}</b>,
                    costEmail: `${(selectedPlan
                      ? (selectedPlan?.planId ? selectedPlan?.fee : 0) / selectedPlan?.quantity
                      : (customPlan?.planId ? customPlan?.fee : 0) / customPlan?.quantity
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
                      ? 'push_notification_selection.selected_push_notification_plan.additional_email_message'
                      : 'push_notification_selection.selected_push_notification_plan.custom_additional_email_message'
                  }`}
                  values={{
                    bold: (chunks) => <b>{chunks}</b>,
                    additionalEmail: `${(selectedPlan
                      ? selectedPlan?.additional
                      : customPlan?.additional
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
            ? `${_(
                'push_notification_selection.selected_push_notification_plan.remove_from_cart_button',
              )}`
            : `${_(
                'push_notification_selection.selected_push_notification_plan.add_to_cart_button',
              )}`}
        </span>
      </button>
    </div>
  );
};

SelectedPushNotificationPlan.propTypes = {
  selectedPlan: PropTypes.shape({
    fee: PropTypes.number,
    quantity: PropTypes.number,
  }),
  item: PropTypes.shape({
    fee: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }),
  addItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};
