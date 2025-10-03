import { useState } from 'react';
import { Promotional } from '../shared/Promotional/Promotional';
import { useIntl } from 'react-intl';
import screenShot_es from './push-configuration--es.png';
import screenShot_en from './push-configuration--en.png';
import logo from './logo.svg';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Navigate, useNavigate } from 'react-router-dom';
import { AddOnType } from '../../doppler-types';

export const PushNotifications = InjectAppServices(
  ({ dependencies: { dopplerBillingUserApiClient, appSessionRef } }) => {
    const {
      pushNotification: { active: pushNotifiactionActive },
      hasClientManager,
      lang,
    } = appSessionRef.current.userData.user;

    const intl = useIntl();
    const navigate = useNavigate();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    if (pushNotifiactionActive) {
      return <Navigate to="/control-panel/push-notification" replace />;
    }

    if (hasClientManager) {
      return <Navigate to="/dashboard" />;
    }

    const [errorMessage, setErrorMessage] = useState(null);
    const { isFreeAccount, trialExpired } = appSessionRef.current.userData.user.plan;

    const handleButtonClick = async () => {
      var response = await dopplerBillingUserApiClient.activateAddOnPlan(
        AddOnType.PushNotifications,
      );
      if (response.success) {
        navigate('/control-panel/push-notification');
      } else {
        setErrorMessage('validation_messages.error_unexpected_register_MD');
      }
    };

    const handleImgClick = async () => {};

    return (
      <>
        <Promotional
          title={_('push_promotional.title')}
          description={_('push_promotional.description')}
          itemCss={'dp-promo-onsite-item'}
          features={[
            <FormattedMessageMarkdown
              id={'push_promotional.features.send_simple_and_effective_alerts'}
            />,
            <FormattedMessageMarkdown id={'push_promotional.features.notify_you_about_news'} />,
            <FormattedMessageMarkdown
              id={'push_promotional.features.redirect_contacts_your_website'}
            />,
            <FormattedMessageMarkdown id={'push_promotional.features.communicate_your_messages'} />,
          ]}
          paragraph_MD={
            <FormattedMessageMarkdown
              id={
                isFreeAccount
                  ? trialExpired
                    ? 'push_promotional.paragraph_free_expired_MD'
                    : 'push_promotional.paragraph_free_MD'
                  : 'push_promotional.paragraph_not_free_MD'
              }
              className="m-b-12"
            />
          }
          actionText={
            isFreeAccount && trialExpired
              ? _('push_promotional.actionText_expired').toUpperCase()
              : _('push_promotional.actionText').toUpperCase()
          }
          actionUrl={isFreeAccount && trialExpired ? _('push_promotional.actionUrl') : ''}
          actionFunc={() => handleButtonClick}
          logoUrl={logo}
          previewUrl={lang === 'es' ? screenShot_es : screenShot_en}
          previewFunc={() => handleImgClick}
          errorMessage={errorMessage}
        />
      </>
    );
  },
);
