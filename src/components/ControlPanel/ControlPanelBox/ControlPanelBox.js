import React from 'react';
import * as S from './ControlPanelBox.styles';
import { useIntl } from 'react-intl';

export const ControlPanelBox = ({ box }) => {
  const _ = (id, values) => useIntl().formatMessage({ id }, values);
  
  return (
    <div className="col-lg-3 col-md-4 col-sm-4 m-b-24">
      <div className="dp-box-shadow">
        <S.Link target="_self" className="dp-white" href={_(box.linkUrl)}>
          <S.Image src={box.imgSrc} alt={_(box.imgAlt)} />
          <S.Text>{_(box.iconName)}</S.Text>
        </S.Link>
      </div>
    </div>
  );
};
