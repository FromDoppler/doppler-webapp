import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { Loading } from '../../../../Loading/Loading';
import { useEffect, useState } from 'react';
import { formattedNumber } from '..';

export const OnSitePlan = InjectAppServices(
  ({ buyUrl, onSitePlan, dependencies: { dopplerPopupHubApiClient } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [loading, setLoading] = useState(true);
    const [availableQuantity, setAvailableQuantity] = useState(0);

    useEffect(() => {
      const fetchAddOnData = async () => {
        if (onSitePlan.active) {
          var getImpressionsResponse = await dopplerPopupHubApiClient.getImpressions();
          if (getImpressionsResponse.success) {
            setAvailableQuantity(onSitePlan.quantity - getImpressionsResponse.value);
          } else {
            setAvailableQuantity(onSitePlan.quantity);
          }
        }

        setLoading(false);
      };

      fetchAddOnData();
    }, [dopplerPopupHubApiClient, onSitePlan.active, onSitePlan.quantity]);

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
                  {_(`my_plan.subscription_details.addon.onsite_plan.title`)}
                </span>
                <span className={`dpicon iconapp-online-clothing`}></span>
              </h3>
              {onSitePlan.fee === 0 && (
                <p>{_('my_plan.subscription_details.addon.onsite_plan.free_label')}</p>
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
                    id={'my_plan.subscription_details.addon.onsite_plan.plan_message'}
                    values={{
                      total: onSitePlan.quantity,
                    }}
                  />
                </strong>
              </p>
              <div className="dp-rowflex">
                <div className="col-lg-5 col-md-12">
                  <p className="plan-item">
                    <FormattedMessage
                      id={`my_plan.subscription_details.addon.onsite_plan.available_message`}
                      values={{
                        available: availableQuantity,
                        total: onSitePlan.quantity,
                      }}
                    />
                  </p>
                </div>
                <div className="col-lg-4 col-md-12">
                  <p className="plan-item m-l-12">
                    {onSitePlan.fee > 0 ? (
                      <FormattedMessage
                        id={`my_plan.subscription_details.addon.onsite_plan.additional_impression_message`}
                        values={{
                          price: formattedNumber(onSitePlan.additional, 4),
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        id={`my_plan.subscription_details.addon.onsite_plan.free_additional_impression_message`}
                      />
                    )}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </article>
      </div>
    );
  },
);
