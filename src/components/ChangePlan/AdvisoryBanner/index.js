import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as S from './index.style';

export const AdvisoryBanner = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <S.Banner className="col-sm-12">
      <div>
        <S.ImgEnterprise
          alt="enterprise icon"
          src={_('common.ui_library_image', { imageUrl: 'asset-enterprise.svg' })}
        />
        <h2>{_('change_plan.banner_exclusive_features_title')}</h2>
        <p>
          <FormattedMessage
            id={'change_plan.banner_exclusive_features_description'}
            values={{
              Bold: (chunk) => <strong>{chunk}</strong>,
            }}
          />
        </p>
      </div>
      <Link
        className="dp-button button-medium secondary-green button--round"
        to="/email-marketing-exclusive"
      >
        {_('change_plan.link_exclusive_features')}
      </Link>
    </S.Banner>
  );
};
