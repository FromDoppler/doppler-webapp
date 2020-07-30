import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl, FormattedDate, FormattedNumber } from 'react-intl';
import { Helmet } from 'react-helmet';
import queryString from 'query-string';
import { extractParameter } from '../../../utils';
import { Loading } from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';
import * as S from './ReportsPartialsCampaigns.styles';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';

const ReportsPartialsCampaigns = ({ location, dependencies: { dopplerApiClient } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fechData = async () => {
      setState({ loading: true });
      const campaignId = extractParameter(location, queryString.parse, 'campaignId');
      let response = await dopplerApiClient.getCampaignNameAndSubject(campaignId);
      if (!response.success) {
        setState({ loading: false });
      } else {
        const campaign = response.value;
        response = await dopplerApiClient.getCampaignSummaryResults(campaignId);
        if (!response.success) {
          setState({ loading: false, featureNoAvailable: true });
        } else {
          setState({
            loading: false,
            campaign: campaign,
            campaignSummaryResults: response.value,
          });
        }
      }
    };
    fechData();
  }, [dopplerApiClient, location]);

  return (
    <>
      {state.loading ? (
        <Loading />
      ) : state.featureNoAvailable ? (
        <p className="dp-boxshadow--error bounceIn">
          <FormattedMessage id="common.feature_no_available" />
        </p>
      ) : !state.campaignSummaryResults ? (
        <p className="dp-boxshadow--error bounceIn">
          <FormattedMessage id="common.unexpected_error" />
        </p>
      ) : (
        <>
          <FormattedMessage id="reports_partials_campaigns.page_title">
            {(page_title) => (
              <Helmet>
                <title>{page_title}</title>
                <meta
                  name="description"
                  content={_('reports_partials_campaigns.page_description')}
                />
              </Helmet>
            )}
          </FormattedMessage>
          <HeaderSection>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <h2>
                <FormattedMessage
                  id={`reports_partials_campaigns.header_title_${state.campaignSummaryResults.campaignStatus}`}
                />
              </h2>
              <p>
                <FormattedMessage
                  id={`reports_partials_campaigns.header_description_${state.campaignSummaryResults.campaignStatus}`}
                />
              </p>
            </div>
          </HeaderSection>

          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="col-sm-12 col-md-12 col-lg-12 m-t-24">
                <S.MainReportBox>
                  <p>
                    <FormattedMessage id="reports_partials_campaigns.campaign_name" />{' '}
                    <strong>{state.campaign.name}</strong>
                  </p>
                  <p>
                    <FormattedMessage id="reports_partials_campaigns.campaign_subject" />{' '}
                    <strong>{state.campaign.subject}</strong>
                  </p>
                </S.MainReportBox>
              </div>

              <S.DetailedInformation>
                <div className="col-sm-12 col-md-4 col-lg-4 m-b-12">
                  <div className="dp-box-shadow">
                    <h2>
                      <FormattedMessage
                        id={`reports_partials_campaigns.${state.campaignSummaryResults.campaignStatus}`}
                      />
                    </h2>
                    <p>
                      <FormattedMessage id="reports_partials_campaigns.campaign_state" />
                    </p>
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4 m-b-12">
                  <div className="dp-box-shadow">
                    <h2>
                      <FormattedNumber value={state.campaignSummaryResults.totalRecipients} />
                    </h2>
                    <p>
                      <FormattedMessage id="reports_partials_campaigns.total_recipients" />{' '}
                    </p>
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4 m-b-12">
                  <div className="dp-box-shadow">
                    <h2>
                      <FormattedNumber value={state.campaignSummaryResults.totalShipped} />
                    </h2>
                    <p>
                      <FormattedMessage id="reports_partials_campaigns.total_sent_so_far" />
                    </p>
                  </div>
                </div>
              </S.DetailedInformation>

              <div className="col-sm-12 m-t-24 m-b-48">
                <div className="dp-box-shadow">
                  <div className="dp-rowflex">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <S.HeaderBox>
                        <h3>
                          <FormattedMessage id="reports_partials_campaigns.delivery_rate" />
                        </h3>
                      </S.HeaderBox>
                      <S.Kpi>
                        <div>
                          <p className="numbers-title">
                            <FormattedNumber value={state.campaignSummaryResults.uniqueOpens} />
                          </p>
                          <p>
                            <FormattedMessage id="reports_partials_campaigns.opened" />
                          </p>
                        </div>
                        <div>
                          <p className="numbers-title">
                            <FormattedNumber value={state.campaignSummaryResults.totalUnopened} />
                          </p>
                          <p>
                            <FormattedMessage id="reports_partials_campaigns.not_open" />
                          </p>
                        </div>
                        <div>
                          <p className="numbers-title">
                            <FormattedNumber
                              value={
                                state.campaignSummaryResults.totalHardBounces +
                                state.campaignSummaryResults.totalSoftBounces
                              }
                            />
                          </p>
                          <p>
                            <FormattedMessage id="reports_partials_campaigns.hard_and_soft" />
                          </p>
                        </div>
                      </S.Kpi>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <S.BackGrey>
                        <S.HeaderBox>
                          <h3>
                            <FormattedMessage id="reports_partials_campaigns.campaign_summary" />
                          </h3>
                        </S.HeaderBox>
                        <S.Summary>
                          <ul>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.total_subscribers" />{' '}
                              <span>
                                <FormattedNumber
                                  value={state.campaignSummaryResults.totalShipped}
                                />
                              </span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.emails_delivered" />{' '}
                              <span>
                                <FormattedNumber
                                  value={state.campaignSummaryResults.successFullDeliveries}
                                />
                              </span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.total_forwarded" />{' '}
                              <span>
                                <FormattedNumber
                                  value={state.campaignSummaryResults.timesForwarded}
                                />
                              </span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.total_openings" />{' '}
                              <span>
                                <FormattedNumber
                                  value={state.campaignSummaryResults.totalTimesOpened}
                                />
                              </span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.last_open_date" />{' '}
                              <span>
                                {state.campaignSummaryResults.lastOpenDate ? (
                                  <FormattedDate
                                    value={state.campaignSummaryResults.lastOpenDate}
                                  />
                                ) : (
                                  '-'
                                )}
                              </span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.unique_clicks" />{' '}
                              <span>
                                <FormattedNumber
                                  value={state.campaignSummaryResults.uniqueClicks}
                                />
                              </span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.unique_opens" />{' '}
                              <span>
                                <FormattedNumber value={state.campaignSummaryResults.uniqueOpens} />
                              </span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.total_clicks" />{' '}
                              <span>
                                <FormattedNumber value={state.campaignSummaryResults.totalClicks} />
                              </span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.last_click_date" />{' '}
                              <span>
                                {state.campaignSummaryResults.lastClickDate ? (
                                  <FormattedDate
                                    value={state.campaignSummaryResults.lastClickDate}
                                  />
                                ) : (
                                  '-'
                                )}
                              </span>
                            </li>
                            <li>
                              <FormattedMessage id="reports_partials_campaigns.total_unsubscribers" />{' '}
                              <span>
                                <FormattedNumber
                                  value={state.campaignSummaryResults.totalUnsubscribers}
                                />
                              </span>
                            </li>
                          </ul>
                        </S.Summary>
                      </S.BackGrey>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default InjectAppServices(ReportsPartialsCampaigns);
