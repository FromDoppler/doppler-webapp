import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../../../services/pure-di';
import { Loading } from '../../../../Loading/Loading';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';

/** Extract the page parameter from url*/
function extractEmail(location) {
  const parsedQuery = location && location.search && queryString.parse(location.search);
  return (parsedQuery && parsedQuery['email']) || null;
}

const SubscriberHistorySentCampaigns = ({ location, dependencies: { dopplerApiClient } }) => {
  const [state, setState] = useState({ loading: true });

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
    <div>
      <div>
        <p>
          {state.subscriber.firstName ? state.subscriber.firstName.value : ''}{' '}
          {state.subscriber.lastName ? state.subscriber.lastName.value : ''}
        </p>
        <p>
          {state.subscriber.status} {state.subscriber.score}
        </p>
      </div>
      <table className="dp-c-table">
        <thead>
          <tr>
            <th>
              <FormattedMessage id="subscriber_history_sent_campaigns.grid_campaign" />
            </th>
            <th>
              <FormattedMessage id="subscriber_history_sent_campaigns.grid_subject" />
            </th>
            <th>
              <FormattedMessage id="subscriber_history_sent_campaigns.grid_delivery" />
            </th>
            <th>
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
  ) : (
    <p className="dp-boxshadow--error bounceIn">
      <FormattedMessage id="common.unexpected_error" />
    </p>
  );
};

export default InjectAppServices(SubscriberHistorySentCampaigns);
