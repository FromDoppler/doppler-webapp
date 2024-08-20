import React, { useState } from 'react';
import { Promotional } from '../shared/Promotional/Promotional';
import { useIntl } from 'react-intl';
import dataStudioGif from './google-data-studio.gif';
import bigQueryLogo from './bigquery_logo.png';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { InjectAppServices } from '../../services/pure-di';
import RedirectToExternalUrl from '../RedirectToExternalUrl';

export const Conversations = InjectAppServices(({ dependencies: { dopplerLegacyClient } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [redirectToConversations, setRedirectToConversations] = useState(false);

  const handleClick = async () => {
    setRedirectToConversations(await dopplerLegacyClient.activateConversationPlan());
  };

  if (redirectToConversations) {
    return <RedirectToExternalUrl to={_('common.conversations_index_url')} />;
  }

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
      actionFunc={() => handleClick}
      logoUrl={bigQueryLogo}
      previewUrl={dataStudioGif}
      caption={<FormattedMessageMarkdown id="big_query.free_text_data_studio_MD" />}
    />
  );
});
