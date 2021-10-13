import React from 'react';
import * as S from './ControlPanelIcon.styles';

export const ControlPanelBox = ({ linkUrl, imgSrc, imgAlt, iconName }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-4 m-b-24">
      <div className="dp-box-shadow">
        <S.Link target="_self" className="dp-white" href={linkUrl}>
          <S.Image src={imgSrc} alt={imgAlt} />
          <S.Text>{iconName}</S.Text>
        </S.Link>
      </div>
    </div>
  );
};
