import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { Loading } from '../../../Loading/Loading';
import { FormattedMessage } from 'react-intl';
import SubscriberHistorySentCampaigns from './SubscriberHistorySentCampaigns/SubscriberHistorySentCampaigns';

const SubscriberHistoryCurrentSearch = ({ email, dependencies: { dopplerApiClient } }) => {
  const [state, setState] = useState({ loading: true });

  const showSubscriberCampaigns = () =>
    setState((prevState) => ({ ...prevState, showSubscriberCampaigns: true }));

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const response = await dopplerApiClient.getSubscriber(email);
      if (response.success) {
        const subscriber = {
          ...response.value,
          firstName: response.value.fields.find((x) => x.name === 'FIRSTNAME'),
          lastName: response.value.fields.find((x) => x.name === 'LASTNAME'),
        };
        setState({ loading: false, subscriber: subscriber });
      } else {
        setState({ loading: false });
      }
    };

    fetchData();
  }, [dopplerApiClient, email]);

  return (
    <div>
      {state.loading ? (
        <Loading />
      ) : state.subscriber ? (
        <>
          <table className="dp-c-table">
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="subscriber_history_current_search.grid_email" />
                </th>
                <th>
                  <FormattedMessage id="subscriber_history_current_search.grid_firstname" />
                </th>
                <th>
                  <FormattedMessage id="subscriber_history_current_search.grid_lastname" />
                </th>
                <th>
                  <FormattedMessage id="subscriber_history_current_search.grid_ranking" />
                </th>
                <th>
                  <FormattedMessage id="subscriber_history_current_search.grid_status" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span onClick={showSubscriberCampaigns}>{state.subscriber.email}</span>
                </td>
                <td>{state.subscriber.firstName ? state.subscriber.firstName.value : ''}</td>
                <td>{state.subscriber.lastName ? state.subscriber.lastName.value : ''}</td>
                <td>{state.subscriber.score}</td>
                <td>{state.subscriber.status}</td>
              </tr>
            </tbody>
          </table>
          {state.showSubscriberCampaigns ? (
            <SubscriberHistorySentCampaigns subscriber={state.subscriber} />
          ) : null}
        </>
      ) : (
        <p className="dp-boxshadow--error bounceIn">
          <FormattedMessage id="trafficSources.error" />
        </p>
      )}
    </div>
  );
};

export default InjectAppServices(SubscriberHistoryCurrentSearch);
