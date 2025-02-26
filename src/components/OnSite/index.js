import { useState } from 'react';
import { Promotional } from '../shared/Promotional/Promotional';
import { useIntl } from 'react-intl';
import screenShot from './Onsites.png';
import logo from './logo.svg';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Navigate } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import Modal from '../Modal/Modal';
import RedirectToExternalUrl from '../RedirectToExternalUrl';

export const OnSite = InjectAppServices(
  ({ dependencies: { dopplerBillingUserApiClient, appSessionRef } }) => {
    const {
      onSite: { active: onSiteActive },
      hasClientManager,
    } = appSessionRef.current.userData.user;

    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    if (onSiteActive) {
      return <RedirectToExternalUrl to={_('common.onsite_widgets_url')} />;
    }

    if (hasClientManager) {
      return <Navigate to="/dashboard" />;
    }

    const [errorMessage, setErrorMessage] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { isFreeAccount, trialExpired } = appSessionRef.current.userData.user.plan;

    const handleButtonClick = async () => {
      if (await dopplerBillingUserApiClient.activateOnSitePlan()) {
        window.location.href = '/popup-hub/widgets';
      } else {
        setErrorMessage('validation_messages.error_unexpected_register_MD');
      }
    };

    const handleImgClick = async () => {
      setModalIsOpen(true);
    };

    return (
      <>
        <Modal
          modalId={'modal-video-container'}
          isOpen={modalIsOpen}
          handleClose={() => setModalIsOpen(false)}
          type={'extra-large'}
        >
          <ReactPlayer
            url="https://www.youtube.com/watch?v=Xy1JDZCRxfo"
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
          title={_('onsite_promotional.title')}
          description={_('onsite_promotional.description')}
          itemCss={'dp-promo-onsite-item'}
          features={[
            <FormattedMessageMarkdown id={'onsite_promotional.features.product_history'} />,
            <FormattedMessageMarkdown id={'onsite_promotional.features.promote_your_products'} />,
            <FormattedMessageMarkdown id={'onsite_promotional.features.capture_information'} />,
            <FormattedMessageMarkdown
              id={'onsite_promotional.features.offer_complementary_products'}
            />,
            <FormattedMessageMarkdown
              id={'onsite_promotional.features.display_products_of_interest'}
            />,
          ]}
          paragraph_MD={
            <FormattedMessageMarkdown
              id={
                isFreeAccount
                  ? trialExpired
                    ? 'onsite_promotional.paragraph_free_expired_MD'
                    : 'onsite_promotional.paragraph_free_MD'
                  : 'onsite_promotional.paragraph_not_free_MD'
              }
              className="m-b-12"
            />
          }
          actionText={
            isFreeAccount && trialExpired
              ? _('onsite_promotional.actionText_expired').toUpperCase()
              : _('onsite_promotional.actionText').toUpperCase()
          }
          actionUrl={isFreeAccount && trialExpired ? _('onsite_promotional.actionUrl') : ''}
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
