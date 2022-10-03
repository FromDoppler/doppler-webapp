import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { FormattedMessage, useIntl } from 'react-intl';
import queryString from 'query-string';
import { extractParameter } from '../../../utils';
import { Pagination } from '../../shared/Pagination/Pagination';
import SafeRedirect from '../../SafeRedirect';
import { useLocation, Link } from 'react-router-dom';

const campaignsPerPage = 10;

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

const SubscriberSentCampaigns = ({
  subscriber,
  dependencies: {
    dopplerApiClient,
    appConfiguration: { reportsUrl },
  },
}) => {
  const [stateSentCampaigns, setStateSentCampaigns] = useState({ loading: true });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const location = useLocation();

  useEffect(() => {
    setStateSentCampaigns({ loading: true });
    if (!subscriber) {
      return;
    }
    const fetchData = async () => {
      const currentPage = extractParameter(location, queryString.parse, 'page') || 1;
      const response = await dopplerApiClient.getSubscriberSentCampaigns(
        subscriber.email,
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
          email: subscriber.email,
        });
      }
    };
    fetchData();
  }, [dopplerApiClient, location, subscriber]);

  if (stateSentCampaigns.redirect) {
    return <SafeRedirect to="/Lists/MasterSubscriber/" />;
  }

  return (
    <div>
      <meta name="doppler-menu-mfe:default-active-item" content="listMasterSubscriberMenu" />
      <div className="dp-table-responsive">
        {stateSentCampaigns.loading ? (
          <Loading page />
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
                    urlToGo={`${location.pathname}?`}
                  />
                </td>
              </tr>
            </tfoot>
            <tbody>
              {stateSentCampaigns.sentCampaigns.length ? (
                <>
                  {stateSentCampaigns.sentCampaigns.map((campaign, index) => {
                    const CampaignReportLink = ({ children }) => {
                      return campaign.isSendingNow ? (
                        <Link to={`/reports/partials-campaigns?campaignId=${campaign.campaignId}`}>
                          {children}
                        </Link>
                      ) : (
                        <a href={`${reportsUrl}/Dashboard.aspx?idCampaign=${campaign.campaignId}`}>
                          {children}
                        </a>
                      );
                    };
                    return (
                      <tr key={index}>
                        <td>
                          {campaign.urlImgPreview ? (
                            <div className="dp-tooltip-container">
                              <CampaignReportLink>
                                {campaign.campaignName}
                                <div className="dp-tooltip-block">
                                  <img
                                    src={campaign.urlImgPreview}
                                    alt={_('subscriber_history.alt_image')}
                                  />
                                </div>
                              </CampaignReportLink>
                            </div>
                          ) : (
                            <CampaignReportLink>{campaign.campaignName}</CampaignReportLink>
                          )}
                        </td>
                        <td>{campaign.campaignSubject}</td>
                        <td>
                          <span className={getDeliveryStatusCssClassName(campaign.deliveryStatus)}>
                            <FormattedMessage
                              id={'subscriber_history.delivery_status.' + campaign.deliveryStatus}
                            />
                          </span>
                        </td>
                        <td>{campaign.clicksCount}</td>
                      </tr>
                    );
                  })}
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
  );
};

export default InjectAppServices(SubscriberSentCampaigns);
