import React, { useState, useEffect } from 'react';
import { Loading } from '../../Loading/Loading';
import { AuthorizationForm } from './ControlPanel/AuthorizationForm';
import { InjectAppServices } from '../../../services/pure-di';
import { Promotional } from '../../shared/Promotional/Promotional';
import { useIntl } from 'react-intl';
import dataStudioGif from './google-data-studio.gif';
import bigQueryLogo from './bigquery_logo.png';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
import { ShowLikeFlash } from '../../shared/ShowLikeFlash/ShowLikeFlash';
import { IconMessage } from '../../form-helpers/form-helpers';
import { successMessageDelay } from '../../../utils';
import { Breadcrumb, BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb';

const FieldItemMessage = ({ message }) => (
  <ShowLikeFlash delay={message.delay}>
    <IconMessage {...message} className="bounceIn" />
  </ShowLikeFlash>
);
const AuthorizationLayout = ({ dependencies: { bigQueryClient, dopplerUserApiClient } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bigQueryEnabled, setBigQueryEnabled] = useState(false);
  const [messageData, setMessageData] = useState(null);

  useEffect(() => {
    const isBigQueryPolicyEnabled = async () => {
      const { success, value } = await dopplerUserApiClient.getFeatures();
      setBigQueryEnabled(success && value.bigQuery);
    };

    const fetchData = async () => {
      const result = await bigQueryClient.getEmailsData();
      if (result.success) {
        setData(result.value.emails);
      }
      await isBigQueryPolicyEnabled();
      setLoading(false);
    };
    fetchData();
  }, [bigQueryClient, dopplerUserApiClient]);

  const onSubmit = async (values) => {
    const emailsData = { emails: [...values.emails] };
    const { success } = await bigQueryClient.saveEmailsData(emailsData);

    if (success) {
      setMessageData({
        text: 'big_query.plus_message_saved',
        type: 'success',
        delay: successMessageDelay,
      });
      setData(emailsData.emails);
    } else {
      setMessageData({
        text: 'big_query.plus_message_error',
        type: 'cancel',
        delay: successMessageDelay,
      });
    }
  };

  if (loading) {
    return <Loading page />;
  }

  if (!bigQueryEnabled) {
    return (
      <Promotional
        title={_('big_query.free_title')}
        description={_('big_query.free_text_summary')}
        features={[
          _('big_query.free_ul_item_strategy'),
          _('big_query.free_ul_item_insights'),
          _('big_query.free_ul_item_filter'),
        ]}
        paragraph={_('big_query.free_text_strong')}
        actionText={_('big_query.free_btn_redirect').toUpperCase()}
        actionUrl={_('big_query.upgrade_plan_url')}
        logoUrl={bigQueryLogo}
        previewUrl={dataStudioGif}
        caption={<FormattedMessageMarkdown id="big_query.free_text_data_studio_MD" />}
      />
    );
  }
  return (
    <div data-active-menu="35" className="dp-library">
      <header className="hero-banner">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <Breadcrumb>
                <BreadcrumbItem
                  href={_('big_query.url_legacy_doppler')}
                  text={_('big_query.plus_beginning')}
                />
                <BreadcrumbItem
                  href="/integrations#native-integrations"
                  text={_('common.integrations')}
                />
                <BreadcrumbItem text={_('big_query.plus_big_query')} />
              </Breadcrumb>
              <h2>{_('big_query.plus_title')}</h2>
            </div>
            <div className="col-lg-7 col-md-7 col-sm-12">
              <FormattedMessageMarkdown id="big_query.plus_header_MD" />
            </div>
          </div>
        </div>
      </header>
      <section className="dp-container m-t-60">
        <div className="dp-rowflex">
          <div className="col-lg-6 col-md-12 col-sm-12 m-b-24 p-b-42">
            <div className="dp-content-left">
              <span>{_('big_query.plus_step_one')}</span>
              <strong>
                <div className="p-heading">
                  <FormattedMessageMarkdown
                    linkTarget={'_blank'}
                    id="big_query.plus_body_step_one_MD"
                  />
                </div>
              </strong>
              <p className="m-t-24">{_('big_query.plus_step_one_paragraph')}</p>
              <div className="m-t-24">
                <FormattedMessageMarkdown id="big_query.plus_step_one_paragraph_MD" />
              </div>
              <AuthorizationForm emails={data} onSubmit={onSubmit} />
            </div>
            <div className="p-t-30">
              {messageData ? <FieldItemMessage message={messageData} /> : <></>}
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 m-b-24 p-b-42">
            <div className="dp-content-right">
              <span>{_('big_query.plus_step_two')}</span>
              <strong>
                <div className="p-heading">
                  <FormattedMessageMarkdown
                    linkTarget={'_blank'}
                    id="big_query.plus_body_step_two_MD"
                  />
                </div>
              </strong>
              <div className="m-t-24">
                <FormattedMessageMarkdown id="big_query.plus_step_two_paragraph_MD" />
              </div>
              <div className="dp-screen">
                <img src={dataStudioGif} alt={_('big_query.free_alt_image')} />
              </div>
            </div>
          </div>
          <div className="col-sm-12 m-b-24">
            <hr className="dp-h-divider"></hr>
            <button type="reset">
              <input
                type="reset"
                className="dp-button button-medium primary-grey m-t-30 m-r-12"
                form="big-query-configuration-form"
                value={_('common.cancel')}
              />
            </button>
            <button type="button">
              <input
                type="submit"
                className="dp-button button-medium primary-green m-l-12"
                form="big-query-configuration-form"
                value={_('common.save')}
              ></input>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export const AuthorizationPage = InjectAppServices(AuthorizationLayout);
