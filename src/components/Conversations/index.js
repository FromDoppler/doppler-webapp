import React, { useState } from 'react';
import { Promotional } from '../shared/Promotional/Promotional';
import { useIntl } from 'react-intl';
import screenShot from './Conversaciones.png';
import logo from './logo.svg';
import { InjectAppServices } from '../../services/pure-di';
import RedirectToExternalUrl from '../RedirectToExternalUrl';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';

export const Conversations = InjectAppServices(
  ({ dependencies: { dopplerLegacyClient, appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [redirectToConversations, setRedirectToConversations] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { isFreeAccount } = appSessionRef.current.userData.user.plan;

    const handleClick = async () => {
      if (await dopplerLegacyClient.activateConversationPlan()) {
        setRedirectToConversations(true);
      } else {
        setErrorMessage('validation_messages.error_unexpected_register_MD');
      }
    };

    if (redirectToConversations) {
      return <RedirectToExternalUrl to={_('common.conversations_index_url')} />;
    }

    return (
      <Promotional
        title={_('conversations.title')}
        description={_('conversations.description')}
        features={[
          <FormattedMessageMarkdown id={'conversations.features.web_chatbot_MD'} />,
          <FormattedMessageMarkdown id={'conversations.features.social_media_chatbot_MD'} />,
          <FormattedMessageMarkdown id={'conversations.features.whatsApp_chatbot_MD'} />,
          <FormattedMessageMarkdown id={'conversations.features.whatsApp_marketing_MD'} />,
          <FormattedMessageMarkdown id={'conversations.features.decision_tree_MD'} />,
        ]}
        paragraph_MD={
          <FormattedMessageMarkdown
            id={
              isFreeAccount
                ? 'conversations.paragraph_free_MD'
                : 'conversations.paragraph_not_free_MD'
            }
            className="m-t-24 m-b-24"
          />
        }
        actionText={_('conversations.actionText').toUpperCase()}
        actionUrl=""
        actionFunc={() => handleClick}
        logoUrl={logo}
        previewUrl={screenShot}
        errorMessage={errorMessage}
      />
    );
  },
);
