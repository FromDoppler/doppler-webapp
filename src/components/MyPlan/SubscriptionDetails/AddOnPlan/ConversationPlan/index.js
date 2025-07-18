import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { Loading } from '../../../../Loading/Loading';
import { useEffect, useState } from 'react';
import { formattedNumber } from '..';

export const ConversationPlan = InjectAppServices(
  ({ buyUrl, conversationPlan, dependencies: { dopplerBeplicApiClient } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [loading, setLoading] = useState(true);
    const [availableQuantity, setAvailableQuantity] = useState(0);

    useEffect(() => {
      const fetchAddOnData = async () => {
        if (conversationPlan.active) {
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1;
          const currentDay = currentDate.getDate();
          const dateFrom =
            currentYear.toString() + '-' + currentMonth.toString().padStart(2, '0') + '-01';
          const dateTo =
            currentYear.toString() +
            '-' +
            currentMonth.toString().padStart(2, '0') +
            '-' +
            currentDay.toString().padStart(2, '0');

          var getConversationsResponse = await dopplerBeplicApiClient.getConversations(
            dateFrom,
            dateTo,
          );

          if (getConversationsResponse.success) {
            setAvailableQuantity(conversationPlan.quantity - getConversationsResponse.value);
          } else {
            setAvailableQuantity(conversationPlan.quantity);
          }
        }
        setLoading(false);
      };

      fetchAddOnData();
    }, [dopplerBeplicApiClient, conversationPlan.active, conversationPlan.quantity]);

    if (loading) {
      return <Loading page />;
    }

    return (
      <div className="dp-box-shadow m-b-24">
        <article className="dp-wrapper-plan">
          <header>
            <div className="dp-title-plan">
              <h3 className="dp-second-order-title">
                <span className="p-r-8 m-r-6">
                  {_(`my_plan.subscription_details.addon.conversation_plan.title`)}
                </span>
                <span className={`dpicon iconapp-chatting`}></span>
              </h3>
              {conversationPlan.fee === 0 && (
                <p>{_('my_plan.subscription_details.addon.conversation_plan.free_label')}</p>
              )}
            </div>
            <div className="dp-buttons--plan">
              <a
                type="button"
                href={buyUrl}
                className="dp-button button-medium primary-green dp-w-100 m-b-12"
              >
                {_(`my_plan.subscription_details.change_plan_button`)}
              </a>
            </div>
          </header>
          <ul className="dp-item--plan">
            <li>
              <p>
                <strong>
                  <FormattedMessage
                    id={'my_plan.subscription_details.addon.conversation_plan.plan_message'}
                    values={{
                      total: conversationPlan.quantity,
                    }}
                  />
                </strong>
              </p>
              <div className="dp-rowflex">
                <div className="col-lg-5 col-md-12">
                  <p className="plan-item">
                    <FormattedMessage
                      id={`my_plan.subscription_details.addon.conversation_plan.available_message`}
                      values={{
                        available: availableQuantity,
                        total: conversationPlan.quantity,
                      }}
                    />
                  </p>
                </div>
                <div className="col-lg-4 col-md-12">
                  <p className="plan-item m-l-12">
                    {conversationPlan.fee > 0 ? (
                      <FormattedMessage
                        id={`my_plan.subscription_details.addon.conversation_plan.additional_conversation_message`}
                        values={{
                          price: formattedNumber(conversationPlan.additionalConversation, 3),
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        id={`my_plan.subscription_details.addon.conversation_plan.free_additional_conversation_message`}
                      />
                    )}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <p>
                <strong>
                  <FormattedMessage
                    id={'my_plan.subscription_details.addon.conversation_plan.agents_title'}
                    values={{
                      agents: conversationPlan.agents,
                    }}
                  />
                </strong>
              </p>
              <p className="plan-item">
                {conversationPlan.fee > 0 ? (
                  <FormattedMessage
                    id={`my_plan.subscription_details.addon.conversation_plan.additional_agent_message`}
                    values={{
                      price: formattedNumber(conversationPlan.additionalAgent, 2),
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id={`my_plan.subscription_details.addon.conversation_plan.free_additional_agent_message`}
                  />
                )}
              </p>
            </li>
            <li>
              <p>
                <strong>
                  <FormattedMessage
                    id={'my_plan.subscription_details.addon.conversation_plan.rooms_title'}
                    values={{
                      rooms: conversationPlan.channels,
                    }}
                  />
                </strong>
              </p>
              <p className="plan-item">
                {conversationPlan.fee > 0 ? (
                  <FormattedMessage
                    id={`my_plan.subscription_details.addon.conversation_plan.additional_room_message`}
                    values={{
                      price: formattedNumber(conversationPlan.additionalChannel, 2),
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id={`my_plan.subscription_details.addon.conversation_plan.free_additional_room_message`}
                  />
                )}
              </p>
            </li>
          </ul>
        </article>
      </div>
    );
  },
);
