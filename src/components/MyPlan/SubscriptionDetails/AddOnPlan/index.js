import { FormattedMessage, useIntl } from 'react-intl';
import { AddOnType } from '../../../../doppler-types';
import { useEffect, useState } from 'react';
import { Loading } from '../../../Loading/Loading';
import { InjectAppServices } from '../../../../services/pure-di';

export const GetAddOnInformation = (addOnType, quantity, available) => {
  switch (addOnType) {
    case AddOnType.Conversations:
      return {
        total: quantity,
        available: available,
        freeLabel: 'my_plan.subscription_details.addon.conversation_plan.free_label',
        planMessageId: 'my_plan.subscription_details.addon.conversation_plan.plan_message',
        availableMessageId:
          'my_plan.subscription_details.addon.conversation_plan.available_message',
        title: `my_plan.subscription_details.addon.conversation_plan.title`,
        icon: 'iconapp-chatting',
      };
    case AddOnType.OnSite:
      return {
        total: quantity,
        available: available,
        freeLabel: 'my_plan.subscription_details.addon.conversation_plan.free_label',
        planMessageId: 'my_plan.subscription_details.addon.onsite_plan.plan_message',
        availableMessageId: 'my_plan.subscription_details.addon.onsite_plan.available_message',
        title: `my_plan.subscription_details.addon.onsite_plan.title`,
        icon: 'iconapp-online-clothing',
      };
    case AddOnType.PushNotifications:
      return {
        total: quantity,
        available: available,
        freeLabel: 'my_plan.subscription_details.addon.conversation_plan.free_label',
        planMessageId: 'my_plan.subscription_details.addon.push_notification_plan.plan_message',
        availableMessageId:
          'my_plan.subscription_details.addon.push_notification_plan.available_message',
        title: `my_plan.subscription_details.addon.push_notification_plan.title`,
        icon: 'iconapp-bell1',
      };
    case AddOnType.Landings:
      return {
        title: 'my_plan.subscription_details.addon.landings_plan.title',
        icon: 'iconapp-landing-page',
        landingsPacksMessage:
          'my_plan.subscription_details.addon.landings_plan.landings_packs_message',
        subtitle: 'my_plan.subscription_details.addon.landings_plan.subtitle',
      };
    default:
      return null;
  }
};

export const AddOnPlan = InjectAppServices(
  ({
    addOnType,
    addOnPlan,
    addOnBuyUrl,
    dependencies: { dopplerBeplicApiClient, dopplerPopupHubApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [addOnInformation, setAddOnInformation] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchAddOnData = async () => {
        var availableQuantity = addOnPlan.quantity;
        if (addOnPlan.active) {
          if (addOnType === AddOnType.Conversations) {
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
              availableQuantity = addOnPlan.quantity - getConversationsResponse.value;
            }
          } else if (addOnType === AddOnType.OnSite) {
            var getImpressionsResponse = await dopplerPopupHubApiClient.getImpressions();
            if (getImpressionsResponse.success) {
              availableQuantity = addOnPlan.quantity - getImpressionsResponse.value;
            }
          }
        }

        setAddOnInformation(GetAddOnInformation(addOnType, addOnPlan.quantity, availableQuantity));

        setLoading(false);
      };

      fetchAddOnData();
    }, [
      dopplerBeplicApiClient,
      dopplerPopupHubApiClient,
      addOnPlan.active,
      addOnPlan.quantity,
      addOnType,
    ]);

    if (loading) {
      return <Loading page />;
    }

    return (
      <div className="dp-box-shadow m-b-24">
        {addOnType !== AddOnType.Landings ? (
          <article className="dp-wrapper-plan">
            <header>
              <div className="dp-title-plan">
                <h3 className="dp-second-order-title">
                  <span className="p-r-8 m-r-6">{_(addOnInformation.title)}</span>
                  <span className={`dpicon ${addOnInformation.icon}`}></span>
                </h3>
                {addOnPlan.fee === 0 && <p>{_(addOnInformation.freeLabel)}</p>}
              </div>
              <div className="dp-buttons--plan">
                <a
                  type="button"
                  href={addOnBuyUrl}
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
                      id={`${addOnInformation.planMessageId}`}
                      values={{
                        total: addOnInformation.total,
                      }}
                    />
                  </strong>
                </p>
                <p>
                  <FormattedMessage
                    id={`${addOnInformation.availableMessageId}`}
                    values={{
                      available: addOnInformation.available,
                      total: addOnInformation.total,
                    }}
                  />
                </p>
              </li>
            </ul>
          </article>
        ) : (
          <article className="dp-wrapper-plan">
            <header>
              <div className="dp-title-plan">
                <h3 className="dp-second-order-title">
                  <span className="p-r-8 m-r-6">{_(addOnInformation.title)}</span>
                  <span className={`dpicon ${addOnInformation.icon}`}></span>
                </h3>
                <p>{_(addOnInformation.subtitle)}</p>
              </div>
              <div className="dp-buttons--plan">
                <a
                  type="button"
                  href={addOnBuyUrl}
                  className="dp-button button-medium primary-green dp-w-100 m-b-12"
                >
                  {_(`my_plan.subscription_details.view_other_packs`)}
                </a>
              </div>
            </header>
            <ul className="dp-item--plan">
              {addOnPlan.landingPacks.map((lp, index) => (
                <li>
                  <p>
                    <strong>
                      <FormattedMessage
                        id={`${addOnInformation.landingsPacksMessage}`}
                        values={{
                          landingPack: lp.landingsQty,
                          landingQty: lp.packageQty,
                        }}
                      />
                    </strong>
                  </p>
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>
    );
  },
);
