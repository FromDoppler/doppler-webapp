import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { FormattedMessage, useIntl } from 'react-intl';
import queryString from 'query-string';
import { extractParameter, replaceSpaceWithSigns } from '../../../utils';
import { Pagination } from '../../shared/Pagination/Pagination';
import SubscriberInfoContainer from '../../shared/SubscriberInfoContainer/SubscriberInfoContainer';
import SafeRedirect from '../../SafeRedirect';

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

const campaignsPerPage = 10;

const SubscriberHistory = ({
  location,
  dependencies: {
    dopplerApiClient,
    appConfiguration: { reportsUrl },
  },
}) => {
  const [stateSentCampaigns, setStateSentCampaigns] = useState({ loading: true });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const Breadcrumb = () => (
    <nav className="dp-breadcrumb">
      <ul>
        <li>
          <a href={_('subscriber_history.subscriber_breadcrumb_url')}>
            {_('subscriber_history.subscriber_breadcrumb')}
          </a>
        </li>
        <li>{_('subscriber_history.behaviour_history_breadcrumb')}</li>
      </ul>
    </nav>
  );

  const email = replaceSpaceWithSigns(extractParameter(location, queryString.parse, 'email'));

  useEffect(() => {
    const fetchData = async () => {
      setStateSentCampaigns({ loading: true });
      const currentPage = extractParameter(location, queryString.parse, 'page') || 1;
      const response = await dopplerApiClient.getSubscriberSentCampaigns(
        email,
        campaignsPerPage,
        currentPage,
      );
      if (!response.success) {
        setStateSentCampaigns({ redirect: true });
      } else {
        setStateSentCampaigns({
          loading: false,
          sentCampaigns: response.value.items,
          itemsCount: response.value.itemsCount,
          currentPage: response.value.currentPage,
          pagesCount: response.value.pagesCount,
          email: email,
        });
      }
    };
    fetchData();
  }, [dopplerApiClient, location, email]);

  if (stateSentCampaigns.redirect) {
    return <SafeRedirect to="/Lists/MasterSubscriber/" />;
  }

  return (
    <>
      <header className="hero-banner report-filters">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <Breadcrumb />
              <h2>
                <FormattedMessage id="subscriber_history.title" />
              </h2>
              <p>
                <FormattedMessage id="subscriber_history.description" />
              </p>
            </div>
          </div>
          <span className="arrow"></span>
        </div>
      </header>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 m-b-36">
            <div className="dp-block-wlp dp-box-shadow">
              <SubscriberInfoContainer email={email} />
              <div>
                <div className="dp-table-responsive">
                  {stateSentCampaigns.loading ? (
                    <Loading />
                  ) : (
                    <table
                      className="dp-c-table"
                      aria-label={_('subscriber_history.table_result.aria_label_table')}
                      summary={_('subscriber_history.table_result.aria_label_table')}
                    >
                      <thead>
                        <tr>
                          <th scope="col">
                            <FormattedMessage id="master_subscriber_sent_campaigns.grid_campaign" />
                          </th>
                          <th scope="col">
                            <FormattedMessage id="master_subscriber_sent_campaigns.grid_subject" />
                          </th>
                          <th scope="col">
                            <FormattedMessage id="master_subscriber_sent_campaigns.grid_delivery" />
                          </th>
                          <th scope="col">
                            <FormattedMessage id="master_subscriber_sent_campaigns.grid_clicks" />
                          </th>
                        </tr>
                      </thead>
                      <tfoot>
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'right' }}>
                            <Pagination
                              currentPage={stateSentCampaigns.currentPage}
                              pagesCount={stateSentCampaigns.pagesCount}
                              urlToGo={`/reports/subscriber-history?email=${stateSentCampaigns.email}&`}
                            />
                          </td>
                        </tr>
                      </tfoot>
                      <tbody>
                        {stateSentCampaigns.sentCampaigns.length ? (
                          <>
                            {stateSentCampaigns.sentCampaigns.map((campaign, index) => (
                              <tr key={index}>
                                <td>
                                  {campaign.urlImgPreview ? (
                                    <div className="dp-tooltip-container">
                                      <a
                                        href={`${reportsUrl}/Dashboard.aspx?idCampaign=${campaign.campaignId}`}
                                      >
                                        {campaign.campaignName}
                                        <div className="dp-tooltip-block">
                                          <img
                                            src={campaign.urlImgPreview}
                                            alt={_('subscriber_history.alt_image')}
                                          />
                                        </div>
                                      </a>
                                    </div>
                                  ) : (
                                    <a
                                      href={`${reportsUrl}/Dashboard.aspx?idCampaign=${campaign.campaignId}`}
                                    >
                                      {campaign.campaignName}
                                    </a>
                                  )}
                                </td>
                                <td>{campaign.campaignSubject}</td>
                                <td>
                                  <span
                                    className={getDeliveryStatusCssClassName(
                                      campaign.deliveryStatus,
                                    )}
                                  >
                                    <FormattedMessage
                                      id={
                                        'subscriber_history.delivery_status.' +
                                        campaign.deliveryStatus
                                      }
                                    />
                                  </span>
                                </td>
                                <td>{campaign.clicksCount}</td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td>
                              <span className="bounceIn">
                                <FormattedMessage id="subscriber_history.empty_data" />
                              </span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(SubscriberHistory);
