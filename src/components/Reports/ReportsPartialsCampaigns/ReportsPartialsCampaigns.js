import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import queryString from 'query-string';
import { extractParameter } from '../../../utils';
import { Loading } from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';

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
          <header className="report-filters">
            <div className="dp-container">
              <div className="dp-rowflex">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <h3>
                    <FormattedMessage id="reports_partials_campaigns.header_title" />
                  </h3>
                  <span className="arrow" />
                </div>
              </div>
            </div>
          </header>
          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="col-sm-12 m-t-24">
                <p>
                  campaña: <strong>{state.campaign.name}</strong>
                </p>
                <p>
                  asunto: <strong>{state.campaign.subject}</strong>
                </p>
              </div>
            </div>
            <div className="dp-rowflex">
              <div className="col-sm-12 m-t-24">
                <p>
                  Estado de la campaña{' '}
                  <strong>{state.campaignSummaryResults.campaignStatus}</strong>
                </p>
                <p>
                  Total recipients <strong>{state.campaignSummaryResults.totalRecipients}</strong>
                </p>
                <p>
                  Total enviados hasta el momento{' '}
                  <strong>{state.campaignSummaryResults.totalShipped}</strong>
                </p>
              </div>
              <div className="col-sm-12 m-t-24">
                <h3>Tasa de entrega</h3>
                <p>
                  <strong>{state.campaignSummaryResults.uniqueOpens}</strong> Abiertos
                </p>
                <p>
                  <strong>{state.campaignSummaryResults.totalUnopened}</strong> No Abiertos
                </p>
                <p>
                  <strong>
                    {state.campaignSummaryResults.totalHardBounces +
                      state.campaignSummaryResults.totalSoftBounces}
                  </strong>{' '}
                  Rebotes Hard y Soft
                </p>
              </div>
              <div className="col-sm-12 m-t-24">
                <h4>Resumen de la campaña:</h4>
                <ul>
                  <li>
                    Total de Suscriptores:
                    <strong> {state.campaignSummaryResults.totalShipped}</strong>
                  </li>
                  <li>
                    Emails Entregados:
                    <strong> {state.campaignSummaryResults.successFullDeliveries}</strong>
                  </li>
                  <li>
                    Cantidad de Reenvíos:
                    <strong> {state.campaignSummaryResults.timesForwarded}</strong>
                  </li>
                  <li>
                    Total de Aperturas:
                    <strong> {state.campaignSummaryResults.totalTimesOpened}</strong>
                  </li>
                  <li>
                    Última Apertura:
                    <strong> {state.campaignSummaryResults.lastOpenDate}</strong>
                  </li>
                  <li>
                    Clicks Únicos:
                    <strong> {state.campaignSummaryResults.uniqueClicks}</strong>
                  </li>
                  <li>
                    Aperturas Únicas:
                    <strong> {state.campaignSummaryResults.uniqueOpens}</strong>
                  </li>
                  <li>
                    Clicks Totales:
                    <strong> {state.campaignSummaryResults.totalClicks}</strong>
                  </li>
                  <li>
                    Último Click:
                    <strong> {state.campaignSummaryResults.lastClickDate}</strong>
                  </li>
                  <li>
                    Cantidad de Remociones:
                    <strong> {state.campaignSummaryResults.totalUnsubscribers}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default InjectAppServices(ReportsPartialsCampaigns);
