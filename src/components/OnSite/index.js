import { useState } from 'react';
import { Promotional } from '../shared/Promotional/Promotional';
import { useIntl } from 'react-intl';
import screenShot from './onsite.svg';
import logo from './logo.svg';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Navigate } from 'react-router-dom';

export const OnSite = InjectAppServices(
  ({ dependencies: { dopplerBillingUserApiClient, appSessionRef } }) => {
    const {
      onSite: { active: onSiteActive },
      hasClientManager,
    } = appSessionRef.current.userData.user;

    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    if (onSiteActive) {
      return <Navigate to="/popup-hub/widgets" />;
    }

    if (hasClientManager) {
      return <Navigate to="/dashboard" />;
    }

    const [errorMessage, setErrorMessage] = useState(null);
    const { isFreeAccount, trialExpired } = appSessionRef.current.userData.user.plan;

    const handleButtonClick = async () => {
      if (await dopplerBillingUserApiClient.activateOnSitePlan()) {
        window.location.href = '/popup-hub/widgets';
      } else {
        setErrorMessage('validation_messages.error_unexpected_register_MD');
      }
    };

    return (
      <>
        <Promotional
          title={_('onsite_promotional.title')}
          description={_('onsite_promotional.description')}
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
          errorMessage={errorMessage}
        />
      </>
    );
  },
);
