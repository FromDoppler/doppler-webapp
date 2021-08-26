import React, { useState, useEffect } from 'react';
import { Loading } from '../../Loading/Loading';
import { AuthorizationForm } from './ControlPanel/AuthorizationForm';
import { InjectAppServices } from '../../../services/pure-di';
import { Promotional } from '../../shared/Promotional/Promotional';
import { useIntl } from 'react-intl';
import dataStudioGif from '../../../img/google-data-studio.gif';
import bigQueryLogo from './styles/bigquery_logo.png';

const AuthorizationLayout = ({ dependencies: { bigQueryClient, dopplerUserApiClient } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bigQueryEnabled, setBigQueryEnabled] = useState(false);

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
      alert('success');
    } else {
      alert('error');
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
        features={[_('big_query.free_ul_item_insights'), _('big_query.free_ul_item_filter')]}
        paragraph={_('big_query.free_text_strong')}
        actionText={_('big_query.free_btn_redirect').toUpperCase()}
        actionUrl={_('big_query.upgrade_plan_url')}
        logoUrl={bigQueryLogo}
        previewUrl={dataStudioGif}
      />
    );
  }

  return (
    <div className="dp-container">
      <div className="dp-rowflex p-t-48">
        <div className="col-lg-5">
          <AuthorizationForm emails={data} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export const AuthorizationPage = InjectAppServices(AuthorizationLayout);
