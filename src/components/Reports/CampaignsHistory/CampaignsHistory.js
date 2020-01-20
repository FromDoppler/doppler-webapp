import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { FormattedMessage, useIntl } from 'react-intl';
import queryString from 'query-string';
import { getSubscriberStatusCssClassName } from '../../../utils';
import { StarsScore } from '../../shared/StarsScore/StarsScore';
import { Pagination } from '../../shared/Pagination/Pagination';

/** Extract the page parameter from url*/
function extractEmail(location) {
  const parsedQuery = location && location.search && queryString.parse(location.search);
  return (parsedQuery && parsedQuery['email']) || null;
}

const getDeliveryStatusCssClassName = (deliveryStatus) => {
  let deliveryCssClass = '';
  switch (deliveryStatus) {
    case 'opened':
      deliveryCssClass = 'status--opened';
      break;
    case 'notOpened':
      deliveryCssClass = 'status--not-opened';
      break;
    case 'hardBounced':
      deliveryCssClass = 'status--hard-bounced';
      break;
    case 'softBounced':
      deliveryCssClass = 'status--soft-bounced';
      break;
    default:
      break;
  }
  return deliveryCssClass;
};

const campaignsPerPage = 5;

const CampaignsHistory = ({ location, dependencies: { dopplerApiClient } }) => {
  const [state, setState] = useState({ loading: true, currentPage: 1 });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const paginate = (pageNumber) =>
    setState((prevState) => {
      return { ...prevState, currentPage: pageNumber };
    });

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
        const response = await dopplerApiClient.getSubscriberSentCampaigns(
          email,
          campaignsPerPage,
          state.currentPage,
        );
        if (!response.success) {
          setState({ loading: false });
        } else {
          setState({
            loading: false,
            sentCampaigns: response.value.items,
            itemsCount: response.value.itemsCount,
            currentPage: response.value.currentPage,
            pagesCount: response.value.pagesCount,
            subscriber: subscriber,
          });
        }
      } else {
        setState({ loading: false });
      }
    };
    fetchData();
  }, [dopplerApiClient, location, state.currentPage]);

  return state.loading ? (
    <Loading />
  ) : state.sentCampaigns ? (
    <section className="dp-container">
      <div className="dp-rowflex">
        <div className="dp-box-shadow m-t-36">
          <div className="col-sm-12 m-t-24">
            <h2>
              {state.subscriber.email}
              <StarsScore score={state.subscriber.score} />
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
                aria-label={_('campaigns_history.table_result.aria_label_table')}
                summary={_('campaigns_history.table_result.aria_label_table')}
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
                  {state.sentCampaigns.length ? (
                    <>
                      {state.sentCampaigns.map((campaign, index) => (
                        <tr key={index}>
                          <td>{campaign.campaignName}</td>
                          <td>{campaign.campaignSubject}</td>
                          <td>
                            <span
                              className={getDeliveryStatusCssClassName(campaign.deliveryStatus)}
                            >
                              <FormattedMessage
                                id={'campaigns_history.delivery_status.' + campaign.deliveryStatus}
                              />
                            </span>
                          </td>
                          <td>{campaign.clicksCount}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'right' }}>
                          <Pagination
                            currentPage={state.currentPage}
                            pagesCount={state.pagesCount}
                            paginate={paginate}
                          />
                        </td>
                      </tr>
                    </>
                  ) : (
                    <p className="dp-boxshadow--usermsg bounceIn">
                      <FormattedMessage id="campaign_history.empty_data" />
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
