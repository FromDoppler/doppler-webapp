import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { Loading } from '../../../Loading/Loading';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
import { getSubscriberStatusCssClassName } from '../../../../utils';
import { StarsScore } from '../../../shared/StarsScore/StarsScore';

const MasterSubscriberCurrentSearch = ({ searchText, dependencies: { dopplerApiClient } }) => {
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
                  <FormattedMessage id="master_subscriber_current_search.grid_email" />
                </th>
                <th>
                  <FormattedMessage id="master_subscriber_current_search.grid_firstname" />
                </th>
                <th>
                  <FormattedMessage id="master_subscriber_current_search.grid_lastname" />
                </th>
                <th>
                  <FormattedMessage id="master_subscriber_current_search.grid_ranking" />
                </th>
                <th>
                  <FormattedMessage id="master_subscriber_current_search.grid_status" />
                </th>
              </tr>
            </thead>
            <tbody>
              {state.subscribers.map((subscriber, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/subscribers/${subscriber.email}/history`}>{subscriber.email}</Link>
                  </td>
                  <td>{subscriber.firstName ? subscriber.firstName.value : ''}</td>
                  <td>{subscriber.lastName ? subscriber.lastName.value : ''}</td>
                  <td>
                    <StarsScore score={subscriber.score} />
                  </td>
                  <td>
                    <div className="dp-icon-wrapper">
                      <span
                        className={
                          'ms-icon icon-user ' + getSubscriberStatusCssClassName(subscriber.status)
                        }
                      ></span>
                      <FormattedMessage id={'subscriber.status.' + subscriber.status} />
                    </div>
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

export default InjectAppServices(MasterSubscriberCurrentSearch);
