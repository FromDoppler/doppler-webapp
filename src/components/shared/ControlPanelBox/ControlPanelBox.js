import React from 'react';
import * as S from './ControlPanelBox.styles';
import connected from '../../Integrations/images/connected.png';
import connection_alert from '../../Integrations/images/connection_alert.png';
import disconnected from '../../Integrations/images/disconnected.png';

export const ControlPanelBox = ({ box }) => {
  const statusImage =
    box.status === 'connected'
      ? connected
      : box.status === 'alert'
      ? connection_alert
      : disconnected;

  if (!!box.hidden) {
    return <></>;
  }

  return (
    <div className="col-lg-3 col-md-4 col-sm-4 m-b-24">
      <div className="dp-box-shadow">
        {!!box.ribbonColor && !!box.ribbonText ? (
          <div className={`dp-ribbon dp-ribbon-top-right dp-ribbon-${box.ribbonColor}`}>
            <span>{box.ribbonText}</span>
          </div>
        ) : (
          <></>
        )}
        {!!box.disabled ? (
          <S.DisabledLink target="_self" className="dp-white" disabled>
            <div>
              <S.Image src={box.imgSrc} alt={box.imgAlt} />
            </div>
            <S.Text>{box.iconName}</S.Text>
          </S.DisabledLink>
        ) : (
          <>
            {box.status ? (
              <S.StatusImage src={statusImage} alt={box.status} aria-label="status image" />
            ) : (
              <></>
            )}
            <S.Link
              target={box.targetBlank ? '_blank' : '_self'}
              className="dp-white"
              href={box.linkUrl}
            >
              <div>
                <S.Image src={box.imgSrc} alt={box.imgAlt} />
              </div>
              <S.Text>{box.iconName}</S.Text>
            </S.Link>
          </>
        )}
      </div>
    </div>
  );
};
