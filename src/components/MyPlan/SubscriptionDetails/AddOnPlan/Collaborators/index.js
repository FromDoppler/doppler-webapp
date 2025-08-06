import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { useEffect, useState } from 'react';
import { Loading } from '../../../../Loading/Loading';

export const Collaborators = InjectAppServices(
  ({ buyUrl, isFreeAccount, dependencies: { dopplerUserApiClient } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [quantity, setQuantity] = useState(0);
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(!isFreeAccount);

    useEffect(() => {
      const fetchData = async () => {
        if (!isFreeAccount) {
          const invitations = await dopplerUserApiClient.getCollaborationInvites();
          if (invitations.success) {
            setCollaborators(invitations.value);
            setQuantity(invitations.value.length);
          }
        }

        setLoading(false);
      };

      fetchData();
    }, [dopplerUserApiClient, isFreeAccount]);

    if (loading) {
      return <Loading page />;
    }

    return (
      <>
        {collaborators.length > 0 ? (
          <div className="dp-box-shadow m-b-24">
            <article className="dp-wrapper-plan">
              <header>
                <div className="dp-title-plan">
                  <h3 className="dp-second-order-title">
                    <span className="p-r-8 m-r-6">
                      {_(`my_plan.subscription_details.addon.collaborators.title`)}
                    </span>
                    <span className={`dpicon iconapp-add-friend`}></span>
                  </h3>
                </div>
                <div className="dp-buttons--plan">
                  <a
                    type="button"
                    href={buyUrl}
                    className="dp-button button-medium primary-green dp-w-100 m-b-12"
                  >
                    {_(`my_plan.subscription_details.contact_advisor_button`)}
                  </a>
                </div>
              </header>
              <ul className="dp-item--plan">
                <li>
                  <p>
                    <strong>
                      <FormattedMessage
                        id={'my_plan.subscription_details.addon.collaborators.plan_message'}
                        values={{
                          total: quantity,
                        }}
                      />
                    </strong>
                  </p>
                  <div className="dp-rowflex">
                    <div className="col-lg-5 col-md-12">
                      <p className="plan-item">
                        <FormattedMessage
                          id={`my_plan.subscription_details.addon.collaborators.available_message`}
                          values={{
                            available: quantity,
                            total: quantity,
                          }}
                        />
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </article>
          </div>
        ) : null}
      </>
    );
  },
);
