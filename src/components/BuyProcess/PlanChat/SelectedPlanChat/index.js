import PropTypes from 'prop-types';
import { numberFormatOptions } from '../../../../doppler-types';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { thousandSeparatorNumber } from '../../../../utils';

export const SelectedPlanChat = ({ selectedPlan, item, addItem, removeItem }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { fee, conversationsQty, agents, channels } = selectedPlan;

  return (
    <div className="dp-boxgrey">
      <div className="dp-price">
        <h2>
          US$ <FormattedNumber value={selectedPlan?.planId ? fee : 0} {...numberFormatOptions} />
          */{_('chat_selection.selected_plan_chat.month_message')}
        </h2>
        {/* <span>
          Antes <span className="dp-line-through">US$ 41,00*</span>
        </span> */}
      </div>
      <h3>{_('chat_selection.selected_plan_chat.conversations_plan_message')}</h3>
      {selectedPlan?.planId ? (
        <ul className="dp-items-plan">
          <li>
            <div className="dp-icon-lock">
              <span className="dp-ico--ok"></span>{' '}
              <span>
                <FormattedMessage
                  id={`chat_selection.selected_plan_chat.includes_until_conversations_message`}
                  values={{
                    conversations: `${thousandSeparatorNumber(
                      intl.defaultLocale,
                      conversationsQty,
                    )}${' '}`,
                  }}
                />
              </span>
            </div>
          </li>
          <li>
            <div className="dp-icon-lock">
              <span className="dp-ico--ok"></span>
              <span>
                <FormattedMessage
                  id="chat_selection.selected_plan_chat.agent_with_plural"
                  values={{ agents: agents }}
                ></FormattedMessage>
              </span>
            </div>
          </li>
          <li>
            <div className="dp-icon-lock">
              <span className="dp-ico--ok"></span>
              <span>
                <FormattedMessage
                  id="chat_selection.selected_plan_chat.channel_with_plural"
                  values={{ channels: channels }}
                ></FormattedMessage>
              </span>
            </div>
          </li>
        </ul>
      ) : (
        <p>{_('chat_selection.selected_plan_chat.no_chat_plan_selected_message')}</p>
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
            ? `${_('chat_selection.selected_plan_chat.remove_from_cart_button')}`
            : `${_('chat_selection.selected_plan_chat.add_to_cart_button')}`}
        </span>
      </button>
    </div>
  );
};

SelectedPlanChat.propTypes = {
  selectedPlan: PropTypes.shape({
    fee: PropTypes.number,
    conversationsQty: PropTypes.number,
    agents: PropTypes.number,
    channels: PropTypes.number,
  }),
  item: PropTypes.shape({
    fee: PropTypes.number.isRequired,
    conversationsQty: PropTypes.number.isRequired,
    agents: PropTypes.number.isRequired,
    channels: PropTypes.number.isRequired,
  }),
  addItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};
