import React, { useState } from 'react';
import { Promotional } from '../shared/Promotional/Promotional';
import { useIntl } from 'react-intl';
import screenShot from './screenShot.png';
import logo from './logo.svg';
import { InjectAppServices } from '../../services/pure-di';
import RedirectToExternalUrl from '../RedirectToExternalUrl';

export const Conversations = InjectAppServices(({ dependencies: { dopplerLegacyClient } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [redirectToConversations, setRedirectToConversations] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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
      paragraph={_('conversations.paragraph')}
      actionText={_('conversations.actionText').toUpperCase()}
      actionUrl=""
      actionFunc={() => handleClick}
      logoUrl={logo}
      previewUrl={screenShot}
      errorMessage={errorMessage}
    />
  );
});
