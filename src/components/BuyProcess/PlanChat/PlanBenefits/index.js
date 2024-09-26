import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export const PlanBenefits = ({ selectedPlan }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const { additionalConversation, additionalAgent, additionalChannel } = selectedPlan;
  const [open, setOpen] = useState(true);

  const toogleOpen = () => setOpen(!open);

  return (
    <section className="m-t-42">
      <h3 className="dp-second-order-title">{_('chat_selection.plan_benefits.title')}</h3>
      <div className="dp-table-plans dp-table-description-plan">
        <div className="dp-table-responsive">
          <table className="dp-c-table m-b-24" aria-label="" summary="">
            <tbody>
              {planBenefits.map((item, index) => (
                <tr key={`id-${index}`}>
                  <td>
                    <span>
                      <strong>{_(item.key)}</strong>
                    </span>
                  </td>
                  <td>
                    <div className="dp-icon-lock">
                      <span className="dp-ico--ok"></span>
                      <span>{_(item.feature_key)}</span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <span className="dp-name-text">
                    <button
                      type="button"
                      className={`dp-expand-results ${open ? 'dp-open-results' : ''}`}
                      onClick={toogleOpen}
                    >
                      <i className="ms-icon icon-arrow-next" />
                    </button>
                    <strong>
                      {_('chat_selection.plan_benefits.additional_costs.additional_costs_message')}
                    </strong>
                  </span>
                </td>
                <td>
                  <div className="dp-icon-lock">
                    <span className="ico-extra-cost" />
                    <span>
                      {_('chat_selection.plan_benefits.additional_costs.extra_costs_message')}
                    </span>
                  </div>
                </td>
              </tr>
              <tr className={`dp-expanded-table ${open ? 'show' : ''}`}>
                <td className="dp-list-results" colSpan="2">
                  <table className="dp-table-results">
                    <tbody>
                      <tr>
                        <td>
                          <ul className="dp-additional-cost">
                            <li>
                              <div className="dp-icon-lock">
                                <span className="dp-ico--ok" />{' '}
                                <span>
                                  {_(
                                    'chat_selection.plan_benefits.additional_costs.additional_conversation_message',
                                  )}
                                </span>
                              </div>
                            </li>
                            <li>
                              <div className="dp-icon-lock">
                                <span className="dp-ico--ok"></span>{' '}
                                <span>
                                  {_(
                                    'chat_selection.plan_benefits.additional_costs.additional_agent_message',
                                  )}
                                </span>
                              </div>
                            </li>
                            <li>
                              <div className="dp-icon-lock">
                                <span className="dp-ico--ok"></span>{' '}
                                <span>
                                  {_(
                                    'chat_selection.plan_benefits.additional_costs.additional_channel_message',
                                  )}
                                </span>
                              </div>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <ul className="dp-additional-cost">
                            <li>
                              <strong>US${(additionalConversation ?? 0).toFixed(2)}*</strong>
                            </li>
                            <li>
                              <strong>US${(additionalAgent ?? 0).toFixed(2)}*</strong>
                            </li>
                            <li>
                              <strong>US${(additionalChannel ?? 0).toFixed(2)}*</strong>
                            </li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <p>
                            <FormattedMessage
                              id={'chat_selection.plan_benefits.additional_costs.legend_1_message'}
                              values={{
                                bold: (chunks) => <b>{chunks}</b>,
                              }}
                            />
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const planBenefits = [
  {
    key: 'chat_selection.plan_benefits.website_chat_message',
    feature_key: 'chat_selection.plan_benefits.included_all_plans_message',
  },
  {
    key: 'chat_selection.plan_benefits.facebook_messenger_chat_message',
    feature_key: 'chat_selection.plan_benefits.included_all_plans_message',
  },
  {
    key: 'chat_selection.plan_benefits.instagram_chat_message',
    feature_key: 'chat_selection.plan_benefits.included_all_plans_message',
  },
  {
    key: 'chat_selection.plan_benefits.whatsapp_business_api_chat_message',
    feature_key:
      'chat_selection.plan_benefits.included_paid_plans_greater_250_conversations_message',
  },
  {
    key: 'chat_selection.plan_benefits.whatsapp_business_api_send_messages_message',
    feature_key:
      'chat_selection.plan_benefits.included_paid_plans_greater_250_conversations_message',
  },
  {
    key: 'chat_selection.plan_benefits.lead_generator_message',
    feature_key: 'chat_selection.plan_benefits.included_all_plans_message',
  },
  {
    key: 'chat_selection.plan_benefits.messages_by_conversation_tree_message',
    feature_key: 'chat_selection.plan_benefits.included_paid_plans_message',
  },
  {
    key: 'chat_selection.plan_benefits.tags_message',
    feature_key: 'chat_selection.plan_benefits.included_all_plans_message',
  },
  {
    key: 'chat_selection.plan_benefits.default_messages_message',
    feature_key: 'chat_selection.plan_benefits.included_all_plans_message',
  },
  {
    key: 'chat_selection.plan_benefits.messages_tracking_message',
    feature_key: 'chat_selection.plan_benefits.included_all_plans_message',
  },
  {
    key: 'chat_selection.plan_benefits.collaborative_care_message',
    feature_key: 'chat_selection.plan_benefits.included_all_plans_message',
  },
  {
    key: 'chat_selection.plan_benefits.support_message',
    feature_key: 'chat_selection.plan_benefits.included_all_plans_message',
  },
];
