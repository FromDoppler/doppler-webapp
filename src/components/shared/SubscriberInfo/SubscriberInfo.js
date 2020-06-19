import React from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { getSubscriberStatusCssClassName } from '../../../utils';
import { StarsScore } from '../../shared/StarsScore/StarsScore';

const SubscriberInfo = ({ subscriber }) => {
  return (
    <>
      <header className="dp-header-campaing dp-rowflex p-l-18">
        <div className="col-lg-6 col-md-12 m-b-24">
          <div className="dp-calification">
            <span className="dp-useremail-campaign">
              <strong>{subscriber.email}</strong>
            </span>
            <StarsScore score={subscriber.score} />
          </div>
          <span className="dp-username-campaing">
            {subscriber.firstName ? subscriber.firstName.value : ''}{' '}
            {subscriber.lastName ? subscriber.lastName.value : ''}
          </span>
          <span className="dp-subscriber-icon">
            <span
              className={'ms-icon icon-user ' + getSubscriberStatusCssClassName(subscriber.status)}
            ></span>
            <FormattedMessage id={'subscriber.status.' + subscriber.status} />
          </span>
          {subscriber.status.includes('unsubscribed') ? (
            <ul className="dp-rowflex col-sm-12 dp-subscriber-info">
              <li className="col-sm-12 col-md-4 col-lg-3">
                <span className="dp-block-info">
                  <FormattedMessage id="subscriber_history.unsubscribed_date" />
                </span>
                <span>
                  <FormattedDate value={subscriber.unsubscribedDate} />
                </span>
              </li>
            </ul>
          ) : null}
        </div>
      </header>
    </>
  );
};

export default InjectAppServices(SubscriberInfo);
