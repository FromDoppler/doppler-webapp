import React from 'react';
import * as S from './ControlPanelBox.styles';

export const ControlPanelBox = ({ box }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-4 m-b-24">
      <div className="dp-box-shadow">
        <S.Link target="_self" className="dp-white" href={box.linkUrl}>
          <S.Image src={box.imgSrc} alt={box.imgAlt} />
          <S.Text>{box.iconName}</S.Text>
        </S.Link>
      </div>
    </div>
  );
};
