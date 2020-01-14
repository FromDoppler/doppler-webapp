import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { Loading } from '../../../Loading/Loading';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
import { getSubscriberStatusCssClassName } from '../../../../utils';

const getStarCssClassName = (actualStarNumber, score) => {
  return actualStarNumber <= score ? 'icon-star' : 'icon-star-filled';
};

const SubscriberHistoryCurrentSearch = ({ searchText, dependencies: { dopplerApiClient } }) => {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const response = await dopplerApiClient.getSubscribers(searchText);
      if (response.success) {
        const subscribers = response.value.items.map((subscriber) => {
          return {
            ...subscriber,
            firstName: subscriber.fields.find((x) => x.name === 'FIRSTNAME'),
            lastName: subscriber.fields.find((x) => x.name === 'LASTNAME'),
          };
        });
        setState({ loading: false, subscribers: subscribers });
      } else {
        // Fallback for production
        const responseSubscriber = await dopplerApiClient.getSubscriber(searchText);
        if (responseSubscriber.success) {
          const subscriber = [
            {
              ...responseSubscriber.value,
              firstName: responseSubscriber.value.fields.find((x) => x.name === 'FIRSTNAME'),
              lastName: responseSubscriber.value.fields.find((x) => x.name === 'LASTNAME'),
            },
          ];
          setState({ loading: false, subscribers: subscriber });
        } else {
          setState({ loading: false });
        }
      }
    };

    fetchData();
  }, [dopplerApiClient, searchText]);

  return (
    <div>
      {state.loading ? (
        <Loading />
      ) : state.subscribers ? (
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
              {state.subscribers.map((subscriber, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/reports/campaigns-history?email=${subscriber.email}`}>
                      {subscriber.email}
                    </Link>
                  </td>
                  <td>{subscriber.firstName ? subscriber.firstName.value : ''}</td>
                  <td>{subscriber.lastName ? subscriber.lastName.value : ''}</td>
                  <td>
                    <div className="dp-calification">
                      <span
                        className={'ms-icon ' + getStarCssClassName(1, subscriber.score)}
                      ></span>
                      <span
                        className={'ms-icon ' + getStarCssClassName(2, subscriber.score)}
                      ></span>
                      <span
                        className={'ms-icon ' + getStarCssClassName(3, subscriber.score)}
                      ></span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        position: 'relative',
                        'margin-right': '20px',
                        'vertical-align': 'super',
                      }}
                      className={getSubscriberStatusCssClassName(subscriber.status)}
                    ></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="dp-boxshadow--error bounceIn">
          <FormattedMessage id="common.unexpected_error" />
        </p>
      )}
    </div>
  );
};

export default InjectAppServices(SubscriberHistoryCurrentSearch);
