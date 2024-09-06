import React, { useState } from 'react';
import { Promotional } from '../shared/Promotional/Promotional';
import { useIntl } from 'react-intl';
import screenShot from './Conversaciones.png';
import logo from './logo.svg';
import { InjectAppServices } from '../../services/pure-di';
import RedirectToExternalUrl from '../RedirectToExternalUrl';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import ReactPlayer from 'react-player/youtube';
import Modal from '../Modal/Modal';

export const Conversations = InjectAppServices(
  ({ dependencies: { dopplerLegacyClient, appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [redirectToConversations, setRedirectToConversations] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { isFreeAccount, trialExpired } = appSessionRef.current.userData.user.plan;

    const handleButtonClick = async () => {
      if (await dopplerLegacyClient.activateConversationPlan()) {
        setRedirectToConversations(true);
      } else {
        setErrorMessage('validation_messages.error_unexpected_register_MD');
      }
    };

    const handleImgClick = async () => {
      setModalIsOpen(true);
    };

    if (redirectToConversations) {
      return <RedirectToExternalUrl to={_('common.conversations_index_url')} />;
    }

    return (
      <>
        <Modal
          modalId={'modal-video-container'}
          isOpen={modalIsOpen}
          handleClose={() => setModalIsOpen(false)}
          type={'extra-large'}
        >
          <ReactPlayer
            url="https://www.youtube.com/watch?v=xzpyU2Zml04"
            controls={true}
            playing={true}
            loop={true}
            width={'800px'}
            height={'450px'}
            config={{
              youtube: {
                playerVars: { rel: 0 },
              },
            }}
          />
        </Modal>

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
                  ? trialExpired
                    ? 'conversations.paragraph_free_expired_MD'
                    : 'conversations.paragraph_free_MD'
                  : 'conversations.paragraph_not_free_MD'
              }
              className="m-b-12"
            />
          }
          actionText={
            isFreeAccount && trialExpired
              ? _('conversations.actionText_expired').toUpperCase()
              : _('conversations.actionText').toUpperCase()
          }
          actionUrl={isFreeAccount && trialExpired ? _('conversations.actionUrl') : ''}
          actionFunc={() => handleButtonClick}
          logoUrl={logo}
          previewUrl={screenShot}
          previewFunc={() => handleImgClick}
          errorMessage={errorMessage}
        />
      </>
    );
  },
);
