import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { FormattedMessage, useIntl } from 'react-intl';
import queryString from 'query-string';
import { getSubscriberStatusCssClassName } from '../../../utils';

/** Extract the page parameter from url*/
function extractEmail(location) {
  const parsedQuery = location && location.search && queryString.parse(location.search);
  return (parsedQuery && parsedQuery['email']) || null;
}

const CampaignsHistory = ({ location, dependencies: { dopplerApiClient } }) => {
  const [state, setState] = useState({ loading: true });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      const email = extractEmail(location);
      const responseSubscriber = await dopplerApiClient.getSubscriber(email);
      if (responseSubscriber.success) {
        const subscriber = {
          ...responseSubscriber.value,
          firstName: responseSubscriber.value.fields.find((x) => x.name === 'FIRSTNAME'),
          lastName: responseSubscriber.value.fields.find((x) => x.name === 'LASTNAME'),
        };
        const response = await dopplerApiClient.getSubscriberSentCampaigns(email);
        if (!response.success) {
          setState({ loading: false });
        } else {
          setState({ loading: false, sentCampaigns: response.value, subscriber: subscriber });
        }
      } else {
        setState({ loading: false });
      }
    };
    fetchData();
  }, [dopplerApiClient, location]);

  return state.loading ? (
    <Loading />
  ) : state.sentCampaigns ? (
    <section className="dp-container">
      <div className="dp-rowflex">
        <div className="dp-box-shadow m-t-36">
          <div className="col-sm-12 m-t-24">
            <h2>
              {state.subscriber.email}
              {/*TODO implementation {state.subscriber.score} */}
            </h2>
            <p>
              {state.subscriber.firstName ? state.subscriber.firstName.value : ''}{' '}
              {state.subscriber.lastName ? state.subscriber.lastName.value : ''}
            </p>
            <span>
              <span
                className={
                  'ms-icon icon-user ' + getSubscriberStatusCssClassName(state.subscriber.status)
                }
              ></span>
              <FormattedMessage id={'subscriber.status.' + state.subscriber.status} />
            </span>
          </div>
          <div className="col-sm-12 dp-block-wlp">
            <div className="dp-table-responsive">
              <table
                className="dp-c-table"
                aria-label={_('campaings_history.table_result.aria_label_table')}
                summary={_('campaings_history.table_result.aria_label_table')}
              >
                <thead>
                  <tr>
                    <th scope="col">
                      <FormattedMessage id="subscriber_history_sent_campaigns.grid_campaign" />
                    </th>
                    <th scope="col">
                      <FormattedMessage id="subscriber_history_sent_campaigns.grid_subject" />
                    </th>
                    <th scope="col">
                      <FormattedMessage id="subscriber_history_sent_campaigns.grid_delivery" />
                    </th>
                    <th scope="col">
                      <FormattedMessage id="subscriber_history_sent_campaigns.grid_clicks" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.sentCampaigns.items.length ? (
                    state.sentCampaigns.items.map((campaign, index) => (
                      <tr key={index}>
                        <td>{campaign.campaignName}</td>
                        <td>{campaign.campaignSubject}</td>
                        <td>{campaign.deliveryStatus}</td>
                        <td>{campaign.clicksCount}</td>
                      </tr>
                    ))
                  ) : (
                    <p className="dp-boxshadow--usermsg bounceIn">
                      <FormattedMessage id="common.empty_data" />
                    </p>
                  )}
                  {}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <p className="dp-boxshadow--error bounceIn">
      <FormattedMessage id="common.unexpected_error" />
    </p>
  );
};

export default InjectAppServices(CampaignsHistory);
