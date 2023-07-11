import React from 'react';
import * as S from './TextPreviewPost.styles';
import { useIntl } from 'react-intl';

export const TextPreviewPost = ({ post, handleStop }) => {
  const { title, description, link, linkDescription, trackingId } = post;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <h3>{_(title)}</h3>
      <S.P>{_(description)}</S.P>
      <a href={_(link)} target="_blank" id={trackingId} onClick={handleStop}>
        <span className="ms-icon icon-arrow-next"></span>
        {_(linkDescription)}
      </a>
    </>
  );
};
