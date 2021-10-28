import React from 'react';
import * as S from './ControlPanelBox.styles';
import { useIntl } from 'react-intl';

export const ControlPanelBox = ({ box, disabled = false }) => {
  const _ = (id, values) => useIntl().formatMessage({ id }, values);

  return (
    <div className="col-lg-3 col-md-4 col-sm-4 m-b-24">
      <div className="dp-box-shadow">
        {disabled ? (
          <S.DisabledLink target="_self" className="dp-white" disabled>
            <div>
              <S.Image src={box.imgSrc} alt={_(box.imgAlt)} />
            </div>
            <S.Text>{_(box.iconName)}</S.Text>
          </S.DisabledLink>
        ) : (
          <S.Link target="_self" className="dp-white" href={box.linkUrl}>
            <div>
              <S.Image src={box.imgSrc} alt={_(box.imgAlt)} />
            </div>
            <S.Text>{_(box.iconName)}</S.Text>
          </S.Link>
        )}
      </div>
    </div>
  );
};
