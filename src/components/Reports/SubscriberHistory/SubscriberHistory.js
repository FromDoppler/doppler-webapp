import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { FormattedMessage, useIntl } from 'react-intl';
import queryString from 'query-string';
import { getSubscriberStatusCssClassName, extractParameter } from '../../../utils';
import { StarsScore } from '../../shared/StarsScore/StarsScore';
import { Pagination } from '../../shared/Pagination/Pagination';

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

const SubscriberHistory = ({ location, dependencies: { dopplerApiClient } }) => {
  const [state, setState] = useState({ loading: true });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const email = extractParameter(location, queryString.parse, 'email');
      const currentPage = extractParameter(location, queryString.parse, 'page') || 1;
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
          currentPage,
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
  }, [dopplerApiClient, location]);

  return state.loading ? (
    <Loading />
  ) : state.sentCampaigns ? (
    <section className="dp-container">
      <div className="dp-rowflex">
        <div className="col-sm-12 m-t-24 m-b-36">
          <div className="dp-block-wlp dp-box-shadow m-t-36">
            <header className="dp-header-campaing dp-rowflex p-l-18">
              <div className="col-lg-6 col-md-12 m-b-24">
                <div class="dp-calification">
                  <span class="dp-useremail-campaign">
                    <strong>{state.subscriber.email}</strong>
                  </span>
                  <StarsScore score={state.subscriber.score} />
                </div>
                <span class="dp-username-campaing">
                  {state.subscriber.firstName ? state.subscriber.firstName.value : ''}{' '}
                  {state.subscriber.lastName ? state.subscriber.lastName.value : ''}
                </span>
                <span className="dp-subscriber-icon">
                  <span
                    className={
                      'ms-icon icon-user ' +
                      getSubscriberStatusCssClassName(state.subscriber.status)
                    }
                  ></span>
                  <FormattedMessage id={'subscriber.status.' + state.subscriber.status} />
                </span>
                {/* TODO: add logic of, Date, IP and Origin campaign.
                  <ul class="dp-rowflex col-sm-12 dp-subscriber-info">
                    <li class="col-sm-12 col-md-4 col-lg-3">
                      <span class="dp-block-info">Fecha de Remoción:</span><span>22/12/2016</span>
                    </li>
                    <li class="col-sm-12 col-md-4 col-lg-3">
                      <span class="dp-block-info">IP origen de Remoción:</span><span>200.5.229.58</span>
                    </li>
                    <li class="col-sm-12 col-md-4 col-lg-5">
                      <span class="dp-block-info">Campaña origen de Remoción:</span><a href="#">Campaña Estacional de Primavera</a>
                    </li>
                  </ul>
                */}
              </div>
              {/* TODO: add kpi logic
            <div class="dp-rowflex col-lg-6 col-md-12">
                <div class="col-sm-6 col-md-3 col-lg-3 m-b-24">
                  <div class="dp-rate-wrapper">
                    <div class="dp-rate-chart">
                      <svg viewBox="0 0 36 36" class="dp-circular-chart dp-stroke-violet">
                        <path class="dp-circle-bg" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        <path class="dp-circle" stroke-dasharray="57, 100" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        <text x="18" y="15" class="dp-text-percentage fadeInDown">
                          open rate
                        </text>
                        <text x="17" y="23" class="dp-percentage fadeInUp">
                          57%
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3 col-lg-3 m-b-24">
                  <ul class="dp-kpi-campaign">
                    <li>
                      <span class="dp-number-campaign dp-color-green">85.0</span>
                    </li>
                    <li><span class="dp-kpi-legend">93 Entregados</span></li>
                  </ul>
                </div>
                <div class="col-sm-6 col-md-3 col-lg-3 m-b-24">
                  <ul class="dp-kpi-campaign">
                    <li>
                      <span class="dp-number-campaign dp-color-red">15.0</span>
                    </li>
                    <li><span class="dp-kpi-legend">12 No Entregados</span></li>
                  </ul>
                </div>
                <div class="col-sm-6 col-md-3 col-lg-3 m-b-24">
                  <ul class="dp-kpi-campaign">
                    <li>
                      <span class="dp-number-campaign dp-kpi-grey">37.0</span>
                    </li>
                    <li><span class="dp-kpi-legend">Clicks totales</span></li>
                  </ul>
                </div>
            </div>
            */}
            </header>
            <div>
              <div className="dp-table-responsive">
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
                          currentPage={state.currentPage}
                          pagesCount={state.pagesCount}
                          urlToGo={`/reports/campaigns-history?email=${state.subscriber.email}&`}
                        />
                      </td>
                    </tr>
                  </tfoot>
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
                                  id={
                                    'subscriber_history.delivery_status.' + campaign.deliveryStatus
                                  }
                                />
                              </span>
                            </td>
                            <td>{campaign.clicksCount}</td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <p className="dp-boxshadow--usermsg bounceIn">
                        <FormattedMessage id="subscriber_history.empty_data" />
                      </p>
                    )}
                    {}
                  </tbody>
                </table>
              </div>
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

export default InjectAppServices(SubscriberHistory);
