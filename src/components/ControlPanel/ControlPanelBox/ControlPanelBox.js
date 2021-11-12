import React from 'react';
import * as S from './ControlPanelBox.styles';
import { useIntl } from 'react-intl';
import connected from '../images/connected.png';
import connection_alert from '../images/connection_alert.png';
import disconnected from '../images/disconnected.png';

export const ControlPanelBox = ({ box }) => {
  const _ = (id, values) => useIntl().formatMessage({ id }, values);
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
        {!!box.disabled ? (
          <S.DisabledLink target="_self" className="dp-white" disabled>
            <div>
              <S.Image src={box.imgSrc} alt={_(box.imgAlt)} />
            </div>
            <S.Text>{_(box.iconName)}</S.Text>
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
                <S.Image src={box.imgSrc} alt={_(box.imgAlt)} />
              </div>
              <S.Text>{_(box.iconName)}</S.Text>
            </S.Link>
          </>
        )}
      </div>
    </div>
  );
};
