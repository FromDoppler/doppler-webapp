import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../../../services/pure-di';
import { Loading } from '../../../../Loading/Loading';
import { FormattedMessage } from 'react-intl';

const SubscriberHistorySentCampaigns = ({ subscriber, dependencies: { dopplerApiClient } }) => {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      const response = await dopplerApiClient.getSubscriberSentCampaigns(subscriber.email);
      if (!response.success) {
        setState({ loading: false });
      } else {
        setState({ loading: false, sentCampaigns: response.value });
      }
    };
    fetchData();
  }, [dopplerApiClient, subscriber]);

  return state.loading ? (
    <Loading />
  ) : state.sentCampaigns ? (
    <div>
      <div>
        <p>
          {subscriber.firstName.value} {subscriber.lastName.value}
        </p>
        <p>
          {subscriber.status} {subscriber.score}
        </p>
      </div>
      <table className="dp-c-table">
        <thead>
          <tr>
            <th>Campaña</th>
            <th>Asunto</th>
            <th>Comportamiento</th>
            <th>Clicks Unicos</th>
          </tr>
        </thead>
        <tbody>
          {state.sentCampaigns.items.map((campaign, index) => (
            <tr key={index}>
              <td>{campaign.campaignName}</td>
              <td>{campaign.campaignSubject}</td>
              <td>{campaign.deliveryStatus}</td>
              <td>{campaign.clicksCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="dp-boxshadow--error bounceIn">
      <FormattedMessage id="trafficSources.error" />
    </p>
  );
};

export default InjectAppServices(SubscriberHistorySentCampaigns);
