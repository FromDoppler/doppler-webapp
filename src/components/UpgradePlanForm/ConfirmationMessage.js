import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export const ConfirmationMessage = ({ isSubscriber, amountSubscribers }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span className="dp-iconmodal-center">
        <img
          alt="newfeature-icon"
          src={_('common.ui_library_image', { imageUrl: 'newfeature-icon.svg' })}
        ></img>
      </span>
      <h1 className="text-align--center">
        <FormattedMessage id="upgradePlanForm.confirmation_title" />
      </h1>
      <p className="text-align--center">
        <FormattedMessage
          id={'upgradePlanForm.confirmation_subtitle_' + (isSubscriber ? 'contact' : 'shipping')}
          values={{
            bold: (chunks) => (
              <b>
                {' '}
                {amountSubscribers} {chunks}{' '}
              </b>
            ),
          }}
        />
      </p>
    </>
  );
};
